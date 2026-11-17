import Link from "next/link";

export default function NotFound() {
  return (
    <section className="hero">
      <div className="w">
        <h1 className="big-title">404.</h1>
        <p className="lede">This page doesn&apos;t exist.</p>
        <div className="btns">
          <Link className="btn p" href="/">Back home</Link>
        </div>
      </div>
    </section>
  );
}
