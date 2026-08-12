import Shell from "@/components/Shell";
export default function Guide() {
  return (
    <Shell>
      <div className="pageHead">
        <div>
          <p className="eyebrow">REVIEW GUIDE</p>
          <h1>검토 가이드</h1>
        </div>
      </div>
      <section className="card">
        <h2>판단 기준</h2>
        <div className="guideGrid">
          <div>
            <b>적정</b>
            <p>현재 내용이 실제 업무와 일치하며 수정할 필요가 없습니다.</p>
          </div>
          <div>
            <b>수정 필요</b>
            <p>방향은 맞지만 표현·범위·수준의 수정이 필요합니다.</p>
          </div>
          <div>
            <b>삭제 검토</b>
            <p>현재 직무에서 수행하지 않거나 중복된 항목입니다.</p>
          </div>
          <div>
            <b>추가 필요</b>
            <p>실제 수행하지만 현재 직무정보에 빠진 항목이 있습니다.</p>
          </div>
        </div>
        <h2>검토 순서</h2>
        <p>
          직무 정의와 목적 → Task와 Activity → Skill → 종합의견 순서로 검토하고,
          판단 근거를 구체적으로 작성해 주세요.
        </p>
      </section>
    </Shell>
  );
}
