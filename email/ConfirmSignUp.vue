<script setup lang="ts">
import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@vue-email/components";

interface Props {
  name: string;
  verifyEmailTokenUrl: string;
}

defineProps<Props>();

const baseUrl = useRuntimeConfig().public.baseUrl;
</script>

<template>
  <Tailwind
    :config="{
      theme: {
        extend: {
          colors: {
            primary: '#000000',
          },
        },
      },
    }">
    <Html>
      <Head />
      <Preview> Welcome! </Preview>
      <Body class="mx-auto my-auto bg-white font-sans">
        <Container class="mb-[16px] mt-[8px] max-w-[640px]">
          <Section class="p-[32px]">
            <Img :src="baseUrl + '/logo.png'" class="h-[86px] w-[72px]" />
          </Section>

          <Section
            class="rounded border border-solid border-gray-200 pb-[48px]">
            <Img :src="baseUrl + '/social-card.png'" class="w-full" />

            <Heading
              class="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              <span class="font-bold">Welcome!</span>
            </Heading>

            <Row class="px-[24px]">
              <Column>
                <Text class="text-[16px] text-black">
                  Hey <span class="font-bold">{{ name }}</span
                  >,
                </Text>
                <Text class="text-[16px] text-black">
                  Please click the button below to confirm your email address.
                </Text>
              </Column>
            </Row>

            <Row class="px-[24px] py-[32px]">
              <Column align="center">
                <Button
                  class="bg-primary mx-auto rounded px-[30px] py-[16px] text-center text-[14px] font-semibold text-white"
                  :href="verifyEmailTokenUrl">
                  Confirm Your Email
                </Button>
              </Column>
            </Row>

            <Row class="px-[24px]">
              <Column>
                <Text class="text-[16px] text-black">
                  or copy and paste this URL into your browser:
                </Text>
                <Link
                  :href="verifyEmailTokenUrl"
                  class="text-gray-700 underline">
                  {{ verifyEmailTokenUrl }}
                </Link>
              </Column>
            </Row>
          </Section>
        </Container>

        <Container class="mb-[24px] max-w-[640px]">
          <Section class="text-center">
            <Text class="text-[12px] leading-[16px] text-gray-500">
              © 2024 qbix
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  </Tailwind>
</template>
