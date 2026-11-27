"use client";

import Link from "next/link";

import { useTemplateIdParam } from "@/hooks/useTemplateIdParam";
import { setProfile, useProfile } from "@/stores/resume-store";

import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/form/section-heading";
import ImageInput from "@/components/form/image-input";
import { TextInput } from "@/components/form/form-input";
import { TextArea } from "@/components/form/form-textarea";

const ProfilePage = () => {
  const templateId = useTemplateIdParam();
  const { firstName, lastName, headline, phone, email, location, summary } =
    useProfile();

  return (
    <div className="space-y-2 rounded border p-4">
      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          nativeButton={false}
          render={<Link href={`/templates`} />}
        >
          Go Back
        </Button>

        <Button
          className="ml-auto"
          nativeButton={false}
          render={<Link href={`/templates/${templateId}/editor/socials`} />}
        >
          Next (Socials)
        </Button>
      </div>

      <SectionHeading>Profile</SectionHeading>

      <div
        className="grid grid-cols-2 gap-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <ImageInput
          className="col-span-2 row-span-2"
          value={useProfile().photo}
          onChange={(photo) => setProfile({ photo })}
        />

        <TextInput
          label="First Name"
          placeholder="Enter your first name"
          value={firstName}
          className="col-span-2 sm:col-span-1"
          setValue={(value) => setProfile({ firstName: value })}
        />

        <TextInput
          label="Last Name"
          placeholder="Enter your last name"
          value={lastName}
          className="col-span-2 sm:col-span-1"
          setValue={(value) => setProfile({ lastName: value })}
        />

        <TextInput
          label="Profession Title"
          placeholder="Enter your profession title"
          className="col-span-2 sm:col-span-1"
          value={headline}
          setValue={(value) => setProfile({ headline: value })}
        />

        <TextInput
          label="Phone Number"
          placeholder="Enter your phone number"
          value={phone}
          setValue={(value) => setProfile({ phone: value })}
        />

        <TextInput
          label="Email Address"
          placeholder="Enter your email address"
          className="col-span-2"
          value={email}
          setValue={(value) => setProfile({ email: value })}
        />

        <TextInput
          label="Address"
          placeholder="Enter your address"
          className="col-span-2"
          value={location}
          setValue={(value) => setProfile({ location: value })}
        />

        <TextArea
          label="About You"
          placeholder="Write a brief about yourself"
          className="col-span-2"
          value={summary}
          setValue={(value) => setProfile({ summary: value })}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
