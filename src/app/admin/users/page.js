"use client";
import { useState } from "react";
import Shell from "@/components/Shell";
export default function Users() {
  const [users, setUsers] = useState(() =>
      typeof window === "undefined"
        ? []
        : JSON.parse(localStorage.getItem("jd_users") || "[]"),
    ),
    [form, setForm] = useState({
      name: "",
      email: "",
      company: "",
      role: "sme",
    });
  function save(next) {
    setUsers(next);
    localStorage.setItem("jd_users", JSON.stringify(next));
  }
  return (
    <Shell admin>
      <div className="pageHead">
        <div>
          <p className="eyebrow">ADMIN</p>
          <h1>사용자 관리</h1>
        </div>
      </div>
      <section className="card">
        <h2>사용자 등록</h2>
        <div className="formGrid">
          <input
            placeholder="이름"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="이메일"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            placeholder="소속회사"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
          />
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="sme">SME</option>
            <option value="admin">관리자</option>
          </select>
          <button
            onClick={() => {
              if (!form.name || !form.email) return;
              save([...users, { ...form, id: Date.now(), active: true }]);
              setForm({ name: "", email: "", company: "", role: "sme" });
            }}
          >
            등록
          </button>
        </div>
      </section>
      <section className="card tableWrap">
        <table>
          <thead>
            <tr>
              <th>이름</th>
              <th>이메일</th>
              <th>회사</th>
              <th>권한</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.company}</td>
                <td>{u.role}</td>
                <td>{u.active ? "사용" : "중지"}</td>
                <td>
                  <button
                    onClick={() =>
                      save(
                        users.map((x) =>
                          x.id === u.id ? { ...x, active: !x.active } : x,
                        ),
                      )
                    }
                  >
                    {u.active ? "비활성화" : "활성화"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </Shell>
  );
}
