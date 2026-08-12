"use client";
import { useEffect, useState } from "react";
import Shell from "@/components/Shell";
import * as XLSX from "xlsx";
const required = {
  job_description: [
    "No.",
    "직군",
    "직렬",
    "직무",
    "정의(Description)",
    "목적(Mission)",
  ],
  task_activity: ["No.", "직무", "Task", "Activity"],
  skill: [
    "No.",
    "직무",
    "skill_name",
    "hard_soft",
    "KSAO",
    "skill_description",
    "related_task",
  ],
};
export default function Data() {
  const [current, setCurrent] = useState([]),
    [report, setReport] = useState(null),
    [parsed, setParsed] = useState(null);
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/data/jobs.json`)
      .then((r) => r.json())
      .then((x) =>
        setCurrent(
          JSON.parse(localStorage.getItem("jd_dataset") || "null")?.jobs || x,
        ),
      );
  }, []);
  function download() {
    const wb = XLSX.utils.book_new(),
      jd = current.map((j) => ({
        "No.": j.id,
        직군: j.job_group,
        직렬: j.job_series,
        직무: j.name,
        "정의(Description)": j.description,
        "목적(Mission)": j.mission,
        서연: j.companies.includes("서연") ? "O" : "",
        서연이화: j.companies.includes("서연이화") ? "O" : "",
        서연탑메탈: j.companies.includes("서연탑메탈") ? "O" : "",
      })),
      ta = current.flatMap((j) =>
        j.tasks.flatMap((t) =>
          t.activities.map((a) => ({
            "No.": j.id,
            직무: j.name,
            Task: t.name,
            Activity: a.text,
          })),
        ),
      ),
      sk = current.flatMap((j) =>
        j.skills.map((s) => ({
          "No.": j.id,
          직무: j.name,
          skill_name: s.name,
          hard_soft: s.hard_soft,
          KSAO: s.ksao,
          skill_description: s.description,
          related_task: s.related_task,
        })),
      );
    [
      ["job_description", jd],
      ["task_activity", ta],
      ["skill", sk],
    ].forEach(([n, d]) =>
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(d), n),
    );
    XLSX.writeFile(wb, "직무정보_표준양식.xlsx");
  }
  async function upload(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.endsWith(".xlsx") || file.size > 10 * 1024 * 1024)
      return setReport({
        errors: [".xlsx 형식, 10MB 이하 파일만 가능합니다."],
        warnings: [],
      });
    const wb = XLSX.read(await file.arrayBuffer()),
      errors = [],
      warnings = [];
    for (const [sheet, cols] of Object.entries(required)) {
      if (!wb.Sheets[sheet]) {
        errors.push(`${sheet}: 필수 시트 누락`);
        continue;
      }
      const head =
        XLSX.utils.sheet_to_json(wb.Sheets[sheet], { header: 1 })[0] || [];
      cols.forEach((c) => {
        if (!head.includes(c)) errors.push(`${sheet}: 필수 컬럼 '${c}' 누락`);
      });
    }
    if (errors.length) return setReport({ errors, warnings });
    const rows = (n) => XLSX.utils.sheet_to_json(wb.Sheets[n], { defval: "" }),
      jd = rows("job_description"),
      ta = rows("task_activity"),
      sk = rows("skill"),
      ids = new Set(),
      names = new Set();
    jd.forEach((r, i) => {
      if (ids.has(r["No."]))
        errors.push(`job_description ${i + 2}행: No. 중복`);
      if (names.has(r["직무"]))
        errors.push(`job_description ${i + 2}행: 직무명 중복`);
      ids.add(r["No."]);
      names.add(r["직무"]);
    });
    ta.forEach((r, i) => {
      if (!ids.has(r["No."]))
        errors.push(`task_activity ${i + 2}행: 고아 직무`);
    });
    sk.forEach((r, i) => {
      if (!ids.has(r["No."])) errors.push(`skill ${i + 2}행: 고아 직무`);
      if (
        !["Hard", "Soft"].includes(r.hard_soft) ||
        !["Knowledge", "Skill", "Ability", "Other"].includes(r.KSAO)
      )
        errors.push(`skill ${i + 2}행: 분류값 오류`);
    });
    const next = jd.map((r, ji) => {
      const ts = [],
        map = {};
      ta.filter((x) => x["No."] === r["No."]).forEach((x, i) => {
        if (!map[x.Task]) {
          map[x.Task] = {
            id: `j${r["No."]}-t${Object.keys(map).length + 1}`,
            order: Object.keys(map).length + 1,
            name: x.Task,
            activities: [],
          };
          ts.push(map[x.Task]);
        }
        if (x.Activity)
          map[x.Task].activities.push({
            id: `j${r["No."]}-a${i + 1}`,
            text: x.Activity,
          });
      });
      return {
        id: Number(r["No."]),
        job_group: String(r["직군"]).trim(),
        job_series: String(r["직렬"]).trim(),
        name: String(r["직무"]).trim(),
        description: String(r["정의(Description)"]).trim(),
        mission: String(r["목적(Mission)"]).trim(),
        companies: ["서연", "서연이화", "서연탑메탈"].filter((c) =>
          ["o", "○"].includes(String(r[c]).toLowerCase()),
        ),
        tasks: ts,
        skills: sk
          .filter((x) => x["No."] === r["No."])
          .map((x, i) => ({
            id: `j${r["No."]}-s${i + 1}`,
            name: x.skill_name,
            hard_soft: x.hard_soft,
            ksao: x.KSAO,
            description: x.skill_description,
            related_task: x.related_task,
          })),
      };
    });
    const old = new Map(current.map((x) => [x.id, x])),
      neu = new Map(next.map((x) => [x.id, x]));
    setParsed(next);
    setReport({
      errors,
      warnings,
      added: next.filter((x) => !old.has(x.id)).length,
      deleted: current.filter((x) => !neu.has(x.id)).length,
      modified: next.filter(
        (x) =>
          old.has(x.id) && JSON.stringify(old.get(x.id)) !== JSON.stringify(x),
      ).length,
      file: file.name,
    });
  }
  return (
    <Shell admin>
      <div className="pageHead">
        <div>
          <p className="eyebrow">ADMIN · DATASET</p>
          <h1>데이터 관리</h1>
        </div>
        <button onClick={download}>표준 양식 다운로드</button>
      </div>
      <div className="stats">
        <div>
          <b>{current.length}</b>
          <span>직무</span>
        </div>
        <div>
          <b>{current.reduce((n, j) => n + j.tasks.length, 0)}</b>
          <span>Task</span>
        </div>
        <div>
          <b>
            {current.reduce(
              (n, j) =>
                n + j.tasks.reduce((m, t) => m + t.activities.length, 0),
              0,
            )}
          </b>
          <span>Activity</span>
        </div>
        <div>
          <b>{current.reduce((n, j) => n + j.skills.length, 0)}</b>
          <span>Skill</span>
        </div>
      </div>
      <section className="card">
        <h2>새 데이터 업로드</h2>
        <input type="file" accept=".xlsx" onChange={upload} />
        {report && (
          <div className="validation">
            <h3>{report.errors.length ? "적용 차단" : "검증 완료"}</h3>
            {report.errors.map((x) => (
              <p className="error" key={x}>
                ✕ {x}
              </p>
            ))}
            {!report.errors.length && (
              <>
                <p>
                  직무 추가 <b>{report.added}</b> · 수정{" "}
                  <b>{report.modified}</b> · 삭제 <b>{report.deleted}</b>
                </p>
                <button
                  onClick={() => {
                    const versions = JSON.parse(
                      localStorage.getItem("jd_versions") || "[]",
                    );
                    versions.unshift({
                      version: versions.length + 2,
                      file: report.file,
                      at: new Date().toISOString(),
                      counts: [parsed.length],
                    });
                    localStorage.setItem(
                      "jd_versions",
                      JSON.stringify(versions),
                    );
                    localStorage.setItem(
                      "jd_dataset",
                      JSON.stringify({ jobs: parsed }),
                    );
                    setCurrent(parsed);
                    alert("새 데이터 버전이 적용되었습니다.");
                  }}
                >
                  이 내용으로 교체 적용
                </button>
              </>
            )}
          </div>
        )}
      </section>
    </Shell>
  );
}
