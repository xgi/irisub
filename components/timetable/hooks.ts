import { useCallback, useRef } from "react";
import { SetterOrUpdater } from "recoil";

// TODO: refactor
// also has logic for if controls can be reordered, which has been removed here
// https://stackoverflow.com/questions/38577224/focus-on-next-field-when-pressing-enter-react-js
export const useFocusNext = (setActiveRow: SetterOrUpdater<number>) => {
  const controls = useRef<HTMLElement[]>([]);

  /**
   * Focus a control relative to another control's index.
   *
   * Does nothing if there is no control at the new index.
   * This also performs setActiveRow on the focused control, if there is one.
   *
   * Note: retrieves the row number from the control's data-row-number attribute in case
   * the indices of the controls don't align with the actual timetable indices (e.g. if the list
   * of controls is virtualized).
   *
   * @param control pivot control (usually the current one)
   * @param indexDelta relative index to focus
   */
  const _focusRelativeControl = (control: HTMLElement, indexDelta: number) => {
    const index = controls.current.indexOf(control);
    const newControl = controls.current[index + indexDelta];

    if (newControl) {
      const newActiveRowNum = newControl.getAttribute("data-row-number");
      if (newActiveRowNum) setActiveRow(parseInt(newActiveRowNum));
      newControl.focus();
    }
  };

  const handler = (event: KeyboardEvent) => {
    if (
      event.key === "Enter" ||
      (event.key === "Tab" && !event.shiftKey) ||
      event.key === "ArrowDown"
    ) {
      _focusRelativeControl(event.target as HTMLElement, 1);
      event.preventDefault();
    } else if (
      event.key === "ArrowUp" ||
      (event.key === "Tab" && event.shiftKey)
    ) {
      _focusRelativeControl(event.target as HTMLElement, -1);
      event.preventDefault();
    }
  };

  return useCallback((element) => {
    if (element && !controls.current.includes(element)) {
      controls.current.push(element);
      element.addEventListener("keydown", handler);
      element.addEventListener("focus", () => console.log("focused an input"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
