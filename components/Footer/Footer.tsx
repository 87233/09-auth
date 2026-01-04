import css from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={css.footer}>
      <div className={css.content}>
        <p>© {new Date().getFullYear()} NoteHub. All rights reserved.</p>
        <div className={css.wrap}>
          <p>Developer: Volodymyr Triukhan </p>
          <p>
            Contact us:
            <a href="8723323@gmail.com">student@notehub.app</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
