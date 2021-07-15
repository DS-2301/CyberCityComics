module.exports = {
  parseTranscript: function (transcript) {
    parsedTranscript = "";
    lines = transcript.split("\n");
    for (const line in lines) {
      switch (lines[line].substr(0, 2)) {
        case "[[":
          parsedTranscript += `<p class="scene-visual">${lines[line].replace(
            /\[|\]/g,
            ""
          )}</p>`;
          break;

        case "((":
          parsedTranscript += `<p class="scene-description">${lines[
            line
          ].replace(/\(|\)/g, "")}</p>`;
          break;

        case "{{":
          parsedTranscript += `<b class="author-comment-head">Author Comment:</b> <span class="author-comment">${lines[
            line
          ].replace(/\{|\}|.*:\s/g, "")}</span>`;
          break;
        default:
          parsedTranscript += `<p class="comic-text">${lines[line]
            .replace(
              /^[0-9A-Za-z-\s#(),]*:/,
              `<span class="speaker">${
                lines[line].substr(0, lines[line].indexOf(":") + 1) + "\n "
              }</span>`
            )
            .replace(/\[\[|\<\<|^\*|\s\*/g, "<span class='scene-visual'> ")
            .replace(/\]\]|\>\>|\*$|\*\s/g, " </span >")}</p>`;
      }
    }
    return parsedTranscript;
  },
  formatDate: function (response) {
    return new Date(
      `${response.year}-${("0" + response.month).slice(-2)}-${(
        "0" + response.day
      ).slice(-2)}T00:00:00`
    ).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  },
};
