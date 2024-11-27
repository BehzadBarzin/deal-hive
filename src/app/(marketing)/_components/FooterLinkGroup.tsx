import Link from "next/link";
import { FC } from "react";

interface IProps {
  title: string;
  links: { label: string; href: string }[];
}

const FooterLinkGroup: FC<IProps> = ({ title, links }) => {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-semibold">{title}</h3>
      <ul className="flex flex-col gap-2 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FooterLinkGroup;
