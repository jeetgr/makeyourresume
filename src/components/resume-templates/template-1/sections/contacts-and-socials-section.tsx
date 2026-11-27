import { icons } from "@/lib/data";

import { useShowSection, useTemplate } from "../../components/template-context";

export default function ContactAndSocialSection() {
  const { data } = useTemplate();
  const { email, phone, location } = data.profile;
  const links = data.links.filter((l) => l.url);
  const showLinks = useShowSection("links", links.length);

  return (
    <div className="flex flex-col gap-[calc(var(--WIDTHPERCENTAGE)*7)]">
      {email && <ContactAndSocialText icon="mail" text={email} />}
      {phone && <ContactAndSocialText icon="phone" text={phone} />}
      {location && <ContactAndSocialText icon="mapPin" text={location} />}

      {showLinks && (
        <ul className="flex flex-col gap-[calc(var(--WIDTHPERCENTAGE)*7)]">
          {links.map(({ id, network, url }) => (
            <li key={id}>
              <ContactAndSocialText icon={network} text={url} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ContactAndSocialText({ icon, text }: { icon: string; text: string }) {
  const { theme } = useTemplate();
  const Icon = icons[icon] || icons.other;

  return (
    <p className="flex flex-col gap-(--WIDTHPERCENTAGE)">
      <span>
        <Icon
          className="h-[calc(var(--WIDTHPERCENTAGE)*12)] w-[calc(var(--WIDTHPERCENTAGE)*12)]"
          color={theme.accent}
        />
      </span>
      <span className="text-[calc(var(--WIDTHPERCENTAGE)*9)] leading-snug break-all">
        {text}
      </span>
    </p>
  );
}
