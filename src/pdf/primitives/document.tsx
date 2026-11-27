import { Document, Page, type PageProps } from "@react-pdf/renderer";

import type { ResumeData } from "@/lib/resume/schema";
import type { Theme } from "@/lib/resume/theme";

import { makeTokens, TokensContext } from "../tokens";

export const fullName = ({ firstName, lastName }: ResumeData["profile"]) =>
  [firstName, lastName].filter(Boolean).join(" ");

/** Document + single wrapping page; provides tokens and base text style. */
export function ResumeDocument({
  data,
  theme,
  pageStyle,
  children,
}: {
  data: ResumeData;
  theme: Theme;
  pageStyle?: PageProps["style"];
  children: React.ReactNode;
}) {
  const tokens = makeTokens(theme);
  const name = fullName(data.profile);

  return (
    <Document
      title={name ? `${name} – Resume` : "Resume"}
      author={name || undefined}
      subject={data.profile.headline || undefined}
      creator="Make Your Resume"
      producer="Make Your Resume"
    >
      <TokensContext value={tokens}>
        <Page
          size={tokens.pageSize}
          wrap
          style={[
            {
              fontFamily: tokens.fontFamily,
              fontSize: tokens.size.sm,
              lineHeight: 1.35,
              color: tokens.text,
            },
            pageStyle ?? {},
          ].flat()}
        >
          {children}
        </Page>
      </TokensContext>
    </Document>
  );
}
