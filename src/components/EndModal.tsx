import React, { useEffect, useRef } from "react";
import classNames from "classnames/bind";
import style from "../assets/styles/layout/endModal.module.scss";

const cn = classNames.bind(style);
const EndModal = ({
  isOpen,
  setIsOpen,
  setTypingText
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setTypingText?: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [firstEndMessageShown, setFirstEndMessageShown] = React.useState(false);
  return (
    <div className={cn("modal-contain", { open: isOpen })}>
      {isOpen && (
        <>
          {!firstEndMessageShown ? (
            <div className={cn("modal-background")}>
              <div className={cn("modal-view")}>
                <h2>
                  Did you have a great time <br />
                  with SophyBARA?
                </h2>
                <p>
                  The conversations you had will be saved anonymously.
                  <br /> We hope you continue to take interest in SophyBARA!
                  <br />
                </p>
                <button
                  onClick={() => {
                    setFirstEndMessageShown(true);
                  }}
                >
                  Save conversation and exit
                </button>
              </div>
            </div>
          ) : (
            <div className={cn("modal-background")}>
              <div className={cn("modal-view")}>
                <h2>Would you like to go back to the home?</h2>
                <p>
                  Your conversation will not be saved and cannot be restored.
                </p>
                <div className={cn("button-explain")}>
                  <button
                    onClick={() => {
                      window.location.replace("/");
                    }}
                  >
                    Yes,Exit
                  </button>

                  <button
                    onClick={() => {
                      setIsOpen(false);
                    }}
                  >
                    No,Continue
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EndModal;
