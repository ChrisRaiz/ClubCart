import './Header.css';

/** Ball emblem and pixel title at the top of the page. */
export default function Header() {
  return (
    <>
      <div className="ball" aria-hidden="true" />
      <h1 className="title">Auto ATC Script Generator</h1>
    </>
  );
}
