import { useLocaleFormate } from "@presentation/hooks";
import { useState } from "react";
interface TextExpanderProps {
  collapsedNumWords?: number;
  expandButtonText?: string;
  collapseButtonText?: string;
  expanded?: boolean;
  buttonColor?: string;
  className?: string;
  children: string;
}
function CustomTestExpander({
  collapsedNumWords = 100,
  expandButtonText = "ShowMore",
  collapseButtonText = "ShowLess",
  buttonColor = "#1f09cd",
  expanded = false,
  className,
  children,
}: TextExpanderProps) {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const _collapseButtonText = useLocaleFormate(collapseButtonText);
  const _expandButtonText = useLocaleFormate(expandButtonText);
  const displayText = isExpanded
    ? children
    : children?.slice(0, collapsedNumWords) + "...";
  const toggleExpanded = () => {
    setIsExpanded((exp) => !exp);
  };
  const buttonStyle = {
    width: "fit-content",
    background: "none",
    border: "none",
    font: "inherit",
    cursor: "pointer",
    marginLeft: "2px",
    marginTop: "5px",
    color: buttonColor,
  };

  return (
    <div className={`mw-350px ` + className}>
      <div dangerouslySetInnerHTML={{ __html: displayText }} />
      <div id="expanderButton" onClick={toggleExpanded} style={buttonStyle}>
        {isExpanded ? _collapseButtonText : _expandButtonText}
      </div>
    </div>
  );
}

export default CustomTestExpander;
