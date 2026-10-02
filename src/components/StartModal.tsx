import React, { useEffect, useRef } from "react";
import classNames from "classnames/bind";
import style from "../assets/styles/layout/startModal.module.scss";

const cn = classNames.bind(style);
const StartModal = ({
  isOpen,
  setIsOpen,
  setTypingText
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setTypingText: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div className={cn("modal-contain", { open: isOpen })}>
      {isOpen && (
        <>
          <div className={cn("modal-background")}>
            <div className={cn("modal-view")}>
              <h2>Welcome to the SophyBARA ARENA!</h2>
              <p>
                The sophyBARA will now begin a discussion based on the question
                you enter. <br />
                Listen closely to what each sophyBARA has to say, and enjoy
                diving into fun <br /> philosophical conversations with our
                sophyBARA!
                <br />
                <span>*SophyBARA only supports Korean and English.*</span>
              </p>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setTypingText(
                    "Please share the topics you’d like to discuss with SophyBARA!"
                  );
                }}
              >
                Debate Start!
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StartModal;
