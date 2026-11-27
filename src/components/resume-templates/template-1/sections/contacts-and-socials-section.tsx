import { LucideIcon } from "lucide-react";

import { isDoubleHyphens } from "@/utils/is-double-hyphens";

import { useAppSelector } from "@/redux/hooks";

import { selectSkippedSection } from "@/redux/features/skipped-sections/skippedSectionSlice";
import { selectAccentColor } from "@/redux/features/custom-styles/customStyleSlice";
import {
  selectProfile,
  selectSocials,
} from "@/redux/features/resume-data/resumeDataSlice";

import { icons } from "@/lib/data";
import { dummyData } from "../../dummy-data";

export default function ContactAndSocialSection() {
  return (
    <div className="flex flex-col gap-[calc(var(--WIDTHPERCENTAGE)*7)]">
      <Contacts />
      <Socials />
    </div>
  );
}

function Contacts() {
  const { email, phone, address } = useAppSelector(selectProfile);

  return (
    <>
      {!isDoubleHyphens(email) && (
        <ContactAndSocialText
          icon="mail"
          text={email || dummyData.profile.email}
        />
      )}
      {!isDoubleHyphens(phone) && (
        <ContactAndSocialText
          icon="phone"
          text={phone || dummyData.profile.phone}
        />
      )}
      {!isDoubleHyphens(address) && (
        <ContactAndSocialText
          icon="mapPin"
          text={address || dummyData.profile.address}
        />
      )}
    </>
  );
}

function Socials() {
  const socials = useAppSelector(selectSocials);

  const shouldSkip = useAppSelector((state) =>
    selectSkippedSection(state, "socials"),
  );

  if (shouldSkip) return null;

  return (
    <ul className="flex flex-col gap-[calc(var(--WIDTHPERCENTAGE)*7)]">
      {(socials.length === 0 ? dummyData.socials : socials).map(
        ({ id, name, url }) =>
          !isDoubleHyphens(url) && (
            <li key={id}>
              <ContactAndSocialText icon={name} text={url} />
            </li>
          ),
      )}
    </ul>
  );
}

function ContactAndSocialText({ icon, text }: { icon: string; text: string }) {
  const accentColor = useAppSelector((state) =>
    selectAccentColor(state, "template-1"),
  );

  const Icon: LucideIcon = icons[icon] || icons.other;

  return (
    <p className="flex flex-col gap-(--WIDTHPERCENTAGE)">
      <span>
        <Icon
          className="h-[calc(var(--WIDTHPERCENTAGE)*12)] w-[calc(var(--WIDTHPERCENTAGE)*12)]"
          color={accentColor}
        />
      </span>
      <span className="text-[calc(var(--WIDTHPERCENTAGE)*9)] leading-snug break-all">
        {text}
      </span>
    </p>
  );
}
