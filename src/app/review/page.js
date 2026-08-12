"use client";
import { useEffect, useMemo, useState } from "react";
import Shell from "@/components/Shell";
import Feedback from "@/components/Feedback";
import { setStatus } from "@/lib/store";
export default function Review() {
  const [data, setData] = useState([]),
    [jobId, setJobId] = useState(""),
    [dirty, setDirty] = useState(false),
    [open, setOpen] = useState({}),
    [group, setGroup] = useState(""),
    [series, setSeries] = useState(""),
    [savedAt, setSavedAt] = useState("");
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/data/jobs.json`)
      .then((r) => r.json())
      .then((x) => {
        const local = JSON.parse(localStorage.getItem("jd_dataset") || "null");
        x = local?.jobs || x;
        setData(x);
        setJobId(String(x[0]?.id || ""));
        setGroup(x[0]?.job_group || "");
        setSeries(x[0]?.job_series || "");
      });
  }, []);
  useEffect(() => {
    const f = (e) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    addEventListener("beforeunload", f);
    return () => removeEventListener("beforeunload", f);
  }, [dirty]);
  const job = useMemo(
    () => data.find((x) => String(x.id) === jobId),
    [data, jobId],
  );
  const groups = [...new Set(data.map((x) => x.job_group))];
  const seriesList = [...new Set(data.filter((x) => x.job_group === group).map((x) => x.job_series))];
  const jobs = data.filter((x) => x.job_group === group && x.job_series === series);
  const statuses = typeof window === "undefined" ? {} : JSON.parse(localStorage.getItem("jd_statuses") || "{}");
  const settings = typeof window === "undefined" ? {} : JSON.parse(localStorage.getItem("jd_settings") || "{}");
  const user =
    typeof window === "undefined"
      ? {}
      : JSON.parse(localStorage.getItem("jd_user") || "{}");
  function change(v) {
    if (dirty && !confirm("저장하지 않은 변경사항이 있습니다. 이동할까요?"))
      return;
    setJobId(v);
    setDirty(false);
  }
  if (!job)
    return (
      <Shell>
        <p>실데이터를 불러오는 중입니다…</p>
      </Shell>
    );
  const F = ({ type, keyName, text }) => (
    <Feedback
      jobId={job.id}
      type={type}
      targetKey={keyName}
      original={text}
      userId={user.email || "demo"}
      onDirty={setDirty}
      onSaved={() => setSavedAt(new Date().toLocaleTimeString("ko-KR", {hour:"2-digit",minute:"2-digit"}))}
    />
  );
  return (
    <Shell>
      {settings.end && <div className="deadline">검토 마감일 {settings.end} · D-{Math.max(0,Math.ceil((new Date(settings.end)-new Date())/86400000))}</div>}
      <div className="pageHead">
        <div>
          <p className="eyebrow">SME REVIEW</p>
          <h1>직무정보 검토</h1>
          <p className="muted">
            원본 정보별 적정성을 판단하고 의견을 남겨주세요.
          </p>
        </div>
        <button
          onClick={() => {
            setStatus(job.id, "검토완료");
            setDirty(false);
            alert("검토가 완료되었습니다.");
          }}
        >
          검토 완료
        </button>
      </div>
      <div className="filters">
        <select value={group} onChange={(e)=>{const g=e.target.value,s=data.find(x=>x.job_group===g)?.job_series,j=data.find(x=>x.job_group===g&&x.job_series===s);setGroup(g);setSeries(s);change(String(j?.id||""))}}>
          {groups.map(x=><option key={x}>{x}</option>)}
        </select>
        <select value={series} onChange={(e)=>{const s=e.target.value,j=data.find(x=>x.job_group===group&&x.job_series===s);setSeries(s);change(String(j?.id||""))}}>
          {seriesList.map(x=><option key={x}>{x}</option>)}
        </select>
        <select value={jobId} onChange={(e) => change(e.target.value)}>
          {jobs.map((x) => (
            <option value={x.id} key={x.id}>
              {statuses[x.id]?.status==='검토완료'?'✓ ':statuses[x.id]?'● ':'○ '}{x.name}
            </option>
          ))}
        </select>
      </div>
      <section className="card">
        <span className="sectionNo">01</span>
        <h2>직무 기본정보</h2>
        <h3>정의</h3>
        <p>{job.description}</p>
        <F type="description" keyName="description" text={job.description} />
        <h3>목적</h3>
        <p>{job.mission}</p>
        <F type="mission" keyName="mission" text={job.mission} />
      </section>
      <section className="card">
        <span className="sectionNo">02</span>
        <h2>
          Task & Activity <small>{job.tasks.length} Tasks</small>
        </h2>
        {job.tasks.map((t) => (
          <article className="task" key={t.id}>
            <button
              className="taskTitle"
              onClick={() => setOpen({ ...open, [t.id]: !open[t.id] })}
            >
              <b>
                {t.order}. {t.name}
              </b>
              <span>{open[t.id] ? "−" : "+"}</span>
            </button>
            <F type="task" keyName={`task:${t.id}`} text={t.name} />
            {open[t.id] && (
              <div className="activities">
                {t.activities.map((a) => (
                  <div key={a.id}>
                    <p>└ {a.text}</p>
                    <F
                      type="activity"
                      keyName={`activity:${a.id}`}
                      text={a.text}
                    />
                  </div>
                ))}
              </div>
            )}
          </article>
        ))}
      </section>
      <section className="card">
        <span className="sectionNo">03</span>
        <h2>
          Skill <small>{job.skills.length} Skills</small>
        </h2>
        <div className="skillGrid">
          {job.skills.map((s) => (
            <article className="skill" key={s.id}>
              <div>
                <span className="tag">{s.hard_soft}</span>
                <span className="tag light">{s.ksao}</span>
              </div>
              <h3>{s.name}</h3>
              <p>{s.description}</p>
              <F type="skill" keyName={`skill:${s.id}`} text={s.name} />
            </article>
          ))}
        </div>
      </section>
      <section className="card">
        <span className="sectionNo">04</span>
        <h2>종합 의견</h2>
        <F type="overall" keyName="overall" text="" />
      </section>
      <div className="saveBar"><span>{savedAt?`마지막 저장 ${savedAt}`:'변경사항은 항목별 반영되며 30초 후 자동 저장됩니다.'}</span><button onClick={()=>{setDirty(false);setSavedAt(new Date().toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'}));alert('임시저장되었습니다.')}}>임시저장</button></div>
    </Shell>
  );
}
