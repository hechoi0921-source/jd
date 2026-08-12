"use client";
import { useState } from "react";
import Shell from "@/components/Shell";
import { getStatuses, setStatus } from "@/lib/store";
export default function My() {
  const [s, setS] = useState(getStatuses()),
    v = Object.entries(s),
    done = v.filter(([, x]) => x.status === "검토완료").length;
  return (
    <Shell>
      <div className="pageHead">
        <div>
          <p className="eyebrow">MY PAGE</p>
          <h1>나의 검토 현황</h1>
        </div>
      </div>
      <div className="stats">
        <div>
          <b>90</b>
          <span>전체 직무</span>
        </div>
        <div>
          <b>{done}</b>
          <span>검토 완료</span>
        </div>
        <div>
          <b>{v.length - done}</b>
          <span>검토 중</span>
        </div>
        <div>
          <b>{90 - v.length}</b>
          <span>미검토</span>
        </div>
      </div>
      <section className="card">
        <h2>검토 이력</h2>
        {v.map(([id, x]) => (
          <div className="statusRow" key={id}>
            <span>직무 #{id}</span>
            <b>{x.status}</b>
            {x.status === "검토완료" && (
              <button
                onClick={() => {
                  setStatus(id, "검토중");
                  setS(getStatuses());
                }}
              >
                재검토 열기
              </button>
            )}
          </div>
        ))}
      </section>
    </Shell>
  );
}
