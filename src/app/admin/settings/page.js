"use client";
import { useState } from "react";
import Shell from "@/components/Shell";
export default function Settings() {
  const old =
      typeof window === "undefined"
        ? {}
        : JSON.parse(localStorage.getItem("jd_settings") || "{}"),
    [form, setForm] = useState(old);
  return (
    <Shell admin>
      <div className="pageHead">
        <div>
          <p className="eyebrow">ADMIN</p>
          <h1>검토 설정</h1>
        </div>
      </div>
      <section className="card formGrid">
        <label>
          검토 시작일
          <input
            type="date"
            value={form.start || ""}
            onChange={(e) => setForm({ ...form, start: e.target.value })}
          />
        </label>
        <label>
          검토 마감일
          <input
            type="date"
            value={form.end || ""}
            onChange={(e) => setForm({ ...form, end: e.target.value })}
          />
        </label>
        <label className="check">
          <input
            type="checkbox"
            checked={!!form.lock}
            onChange={(e) => setForm({ ...form, lock: e.target.checked })}
          />{" "}
          마감 후 읽기 전용
        </label>
        <label>
          SME 안내 문구
          <input
            value={form.notice || ""}
            onChange={(e) => setForm({ ...form, notice: e.target.value })}
          />
        </label>
        <button
          onClick={() => {
            localStorage.setItem("jd_settings", JSON.stringify(form));
            alert("설정이 저장되었습니다.");
          }}
        >
          설정 저장
        </button>
      </section>
    </Shell>
  );
}
