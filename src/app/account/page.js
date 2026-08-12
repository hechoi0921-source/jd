"use client";
import { useState } from "react";
import Shell from "@/components/Shell";
export default function Account() {
  const [pw, setPw] = useState(""),
    [ok, setOk] = useState("");
  return (
    <Shell>
      <div className="pageHead">
        <div>
          <p className="eyebrow">ACCOUNT</p>
          <h1>계정 관리</h1>
        </div>
      </div>
      <section className="card narrow">
        <h2>비밀번호 변경</h2>
        <p className="muted">
          GitHub Pages 로컬 운영 모드에서는 이 브라우저에만 적용됩니다.
        </p>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="새 비밀번호 (8자 이상)"
        />
        <button
          onClick={() => {
            if (pw.length < 8) return setOk("8자 이상 입력해 주세요.");
            localStorage.setItem("jd_local_password", pw);
            setPw("");
            setOk("변경되었습니다.");
          }}
        >
          변경
        </button>
        {ok && <p>{ok}</p>}
      </section>
    </Shell>
  );
}
