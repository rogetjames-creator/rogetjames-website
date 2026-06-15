import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import { X, ChevronLeft, ChevronRight, Pause, Play, Search } from "lucide-react";
import CatPageViewer from "./CatPageViewer";

gsap.registerPlugin(ScrollTrigger);


const CDN = "https://cdn.myportfolio.com/b2648aa0-9d7e-45a7-9f99-54d55b4ec92e";

const STRIP_IMAGES = [
  `${CDN}/bfb2cefd-e38d-4cbf-86cb-eb955a34f2f9_rw_3840.jpg?h=d8252802c5923b6c85bfbb1d48ffd3f4`,
  `${CDN}/453b1942-6be0-4365-b111-0affe46a048e_rw_1920.jpg?h=968dc8dad1b2ec3603236a03c95526df`,
  `${CDN}/d2a97109-c3ab-4f3b-a219-3726bdcaa590_rw_1920.jpg?h=e19cb2a02fabf0399f96c89d0deaa24d`,
  `${CDN}/4abdd8f3-44a5-4a24-b6cb-ccdb233b297e_rw_1920.jpeg?h=b6df39c4e5d452fcf8293dc8052d0399`,
  `${CDN}/79a0816f-0847-4bb5-aa06-a9077f7db746_rw_1200.jpg?h=1fcf914a6813bdea5a959d6dc3a50086`,
  "/images/hero/hero-marakesh-wide.jpg",
  "/images/hero/hero-marakesh-tall.jpg",
  "/images/hero/hero-homebase-dusk.jpg",
  "/images/hero/hero-homebase-totems.jpg",
  "/images/hero/hero-homebase-entrance.jpg",
  "/images/hero/hero-homebase-sculpture.jpg",
  "/images/hero/hero-cottesloe-patio.jpg",
  "/images/hero/hero-cottesloe-gate.jpg",
  "/images/hero/hero-commercial-helvetica.jpg",
  `${CDN}/b32ea229-d756-4e86-9f8e-ddd64ab25e66_rw_1200.jpg?h=11202a4f895ca6ffb66c1ea982364b6c`,
];

const COMMISSIONS = {
  commercial: [
    {
      id: "commercial-1",
      label: "HOSPITALITY & RETAIL",
      items: [
        { name: "ERGO",            img: `${CDN}/407aaa0c-2e00-4727-8033-fb2d4c493345_rw_1920.jpg?h=afa196b9d8ede40d7b62b4f0ba4aa48f`, pos: "left center" },
        { name: "LUMIER",          img: `${CDN}/65df5eb8-8965-49e7-a31c-9fdd5db80da9_rw_1200.jpg?h=8fa0436374c48082a687a93785e8c28e` },
        { name: "XAVIER",          img: `${CDN}/f3dc2b7b-8496-45da-9ff9-8bc4ba20e8f7_rw_1920.jpg?h=e6346e68c6fdfb984159856228b18dc4` },
        { name: "GRAIL",           img: `${CDN}/bfb2cefd-e38d-4cbf-86cb-eb955a34f2f9_rw_3840.jpg?h=d8252802c5923b6c85bfbb1d48ffd3f4` },
      ],
    },
    {
      id: "commercial-2",
      label: "ARCHITECTURAL SCREENS",
      items: [
        { name: "GRAIL",   description: "Grail privacy screen — under-framed divider and tinted perspex", img: `${CDN}/bfb2cefd-e38d-4cbf-86cb-eb955a34f2f9_rw_3840.jpg?h=d8252802c5923b6c85bfbb1d48ffd3f4` },
        { name: "FERLIE",  img: `${CDN}/a8f3ce2e-c51d-47fa-bbee-4563523ef01a_rw_1920.jpg?h=8ed539c980ba51543bf04a555b8b5e93` },
        { name: "LUCARIO", img: `${CDN}/dfb5f9eb-ba6e-4863-9a8f-e75c77d22339_rw_1200.jpg?h=040e8d1a3bc81a9e3a71209f6979b222` },
        { name: "VAYA",    img: `${CDN}/f158bc26-4f22-47d2-bee1-ba39cc74113e_rw_1200.jpg?h=9b291706b6c76ce980996749ddcac948` },
        { name: "WATTLE",  img: `${CDN}/4f9d07e7-a1ba-4215-b4ed-86dee879d606_rw_600.jpg?h=98b5087c0cadf4a5f192beb793d55296` },
        { name: "VUELTA",              img: `${CDN}/1fcdb08d-cdb7-4792-8883-01100fee426d_rw_1200.jpg?h=9714e17c2c6817b7853e5c5b3572f750` },
        { name: "VUELTA Aquilla Homes",img: `${CDN}/764a0e79-ff27-475c-9d20-83c1d9eb75df_rw_1200.jpg?h=9d3184e28d977bc2302e1257338e6202` },
        { name: "ASLYIAM",             img: `${CDN}/50c8fb4e-fa4f-459c-89a0-01fb69b9a875_rw_1920.jpg?h=df73cbda10ac29b35c6dc97ed20ff906` },
        { name: "ASLYIAM Light Feature",img: `${CDN}/1a26b497-b278-4edc-a050-a2b42e3718d4_rw_1200.jpg?h=c9c84b6bfadb268cbc11d45d092376b6` },
        { name: "ASLYIAM Cellar Door", img: `${CDN}/5387f1db-afbb-40f2-9e31-b1fcdf5163a5_rw_600.jpg?h=7534bc99219be8c316a514e9aa4d53d9` },
        { name: "ASLYIAM — Diamond Nails", img: "/images/aslyiam/aslyiam-diamond-nails.jpg" },
        { name: "AUDA",                img: `${CDN}/18320e7a-11d9-401e-be88-2882883feca6_rw_1920.jpg?h=4b46a811c317a0c4c6d1371ba030aba1` },
        { name: "CHIOLA",              img: `${CDN}/a7051a98-18b5-4a76-bf4f-f9569636a04b_rw_1200.jpg?h=f0f12a678192c73ee2eb9f303da0c70e` },
        { name: "ERGO Cottesloe Hotel", img: `${CDN}/9ea86aef-4d28-4b92-bb98-5293deef8c93_rw_3840.jpg?h=0eaa14f335accdf89ebd50e55234a8fd`, slides: [`${CDN}/9ea86aef-4d28-4b92-bb98-5293deef8c93_rw_3840.jpg?h=0eaa14f335accdf89ebd50e55234a8fd`, `${CDN}/ff393903-5912-40da-9b37-aca22ef599b4_rw_1920.jpg?h=1ef862e9145edcf101d46bcd4a02fb15`] },
        { name: "ORIEL",               img: `${CDN}/8e870d8c-8b02-4a6a-82b2-7aed7fc22c83_rw_1920.jpg?h=6b581f0dca9b07bc0e4238973f68d875` },
        { name: "DOTTI",               img: `${CDN}/5d641ee3-f68a-46f0-836e-a439215cb153_rw_1200.jpg?h=2e876a49c3a095d458f3147933679842` },
        { name: "XAVIER",              img: `${CDN}/f3dc2b7b-8496-45da-9ff9-8bc4ba20e8f7_rw_1920.jpg?h=e6346e68c6fdfb984159856228b18dc4` },
        { name: "LUMIER",              img: `${CDN}/65df5eb8-8965-49e7-a31c-9fdd5db80da9_rw_1200.jpg?h=8fa0436374c48082a687a93785e8c28e` },
      ],
    },
    {
      id: "commercial-3",
      label: "CORPORATE FEATURES",
      items: [
        { name: "BENIN Inspired",     img: `${CDN}/e6796e77-b853-4fca-99ee-5915afe3f048_rw_1920.jpg?h=263b62acc4a3c578c5362e2ffad7d532` },
        { name: "RAVI Inspired",      img: `${CDN}/737c1792-472d-4328-9c28-1f74c7f49d95_rw_1920.jpg?h=d80df3f24ed7c830fa26da48c78684f6` },
        { name: "Unity in Diversity", img: `${CDN}/6745c491-3d3b-4501-b01c-76a351d2d9d1_rw_1920.jpeg?h=52cf56ba89edab095b94d025686dd55a` },
        { name: "VUELTA",             img: `${CDN}/1fcdb08d-cdb7-4792-8883-01100fee426d_rw_1200.jpg?h=9714e17c2c6817b7853e5c5b3572f750` },
        { name: "ASLYIAM",            img: `${CDN}/50c8fb4e-fa4f-459c-89a0-01fb69b9a875_rw_1920.jpg?h=df73cbda10ac29b35c6dc97ed20ff906` },
      ],
    },
    {
      id: "commercial-4",
      label: "SIGNAGE & FACADES",
      items: [
      ],
    },
    {
      id: "commercial-5",
      label: "LIGHTING FEATURES",
      items: [],
    },
    {
      id: "commercial-6",
      label: "FEATURED PROJECTS",
      items: [
        { name: "MARAKESH",           img: "/images/hero/hero-marakesh-wide.jpg", slides: ["/images/hero/hero-marakesh-wide.jpg", "/images/hero/hero-marakesh-tall.jpg"] },
        { name: "HOMEBASE Dusk",      img: "/images/hero/hero-homebase-dusk.jpg" },
        { name: "HOMEBASE Totems",    img: "/images/hero/hero-homebase-totems.jpg" },
        { name: "HOMEBASE Entrance",  img: "/images/hero/hero-homebase-entrance.jpg" },
        { name: "HOMEBASE Sculpture", img: "/images/hero/hero-homebase-sculpture.jpg" },
        { name: "Cottesloe",          img: "/images/hero/hero-cottesloe-patio.jpg", slides: ["/images/hero/hero-cottesloe-patio.jpg", "/images/hero/hero-cottesloe-gate.jpg"] },
        { name: "Helvetica",          img: "/images/hero/hero-commercial-helvetica.jpg" },
      ],
    },
  ],
  public: [
    {
      id: "public-1",
      label: "PUBLIC ART",
      items: [
        { name: "Fiona Stanley",      img: `${CDN}/13dddf44-cb0a-4ad6-a4ac-3b229792d04d_rw_1920.jpg?h=0542d30e647f6e1d326dee723044be1b` },
        { name: "Unity in Diversity", img: `${CDN}/6745c491-3d3b-4501-b01c-76a351d2d9d1_rw_1920.jpeg?h=52cf56ba89edab095b94d025686dd55a` },
        { name: "BENIN Inspired",     img: `${CDN}/e6796e77-b853-4fca-99ee-5915afe3f048_rw_1920.jpg?h=263b62acc4a3c578c5362e2ffad7d532` },
        { name: "RAVI Inspired",      img: `${CDN}/737c1792-472d-4328-9c28-1f74c7f49d95_rw_1920.jpg?h=d80df3f24ed7c830fa26da48c78684f6` },
      ],
    },
    {
      id: "public-2",
      label: "SCULPTURES & TOTEMS",
      items: [
        { name: "OMARE (Custom)",                 img: `/images/omare-marion-front.jpg` },
        { name: "Unity in Diversity",             img: `${CDN}/6745c491-3d3b-4501-b01c-76a351d2d9d1_rw_1920.jpeg?h=52cf56ba89edab095b94d025686dd55a` },
        { name: "UNITY IN DIVERSITY",             img: `${CDN}/b32ea229-d756-4e86-9f8e-ddd64ab25e66_rw_1200.jpg?h=11202a4f895ca6ffb66c1ea982364b6c`, slides: [`${CDN}/b32ea229-d756-4e86-9f8e-ddd64ab25e66_rw_1200.jpg?h=11202a4f895ca6ffb66c1ea982364b6c`, `${CDN}/5504bc00-e901-49b2-b14b-337476409a29_rw_1200.jpg?h=a80899311d752bd29777628bfaf7ea92`, `${CDN}/e0829bf1-b7fb-433d-a143-748457e1a18f_rw_1200.jpg?h=035bb64ea46ea3204adb05d29e707054`, `${CDN}/ce906d3c-248e-42c2-a76c-e7547bae20e7_rw_1200.jpg?h=96bf8823ab48bc3e90055aef0b93ea1f`] },
        { name: "UNITY IN DIVERSITY",             img: `${CDN}/ce906d3c-248e-42c2-a76c-e7547bae20e7_rw_1200.jpg?h=96bf8823ab48bc3e90055aef0b93ea1f` },
        { name: "HOMEBASE Totems",                img: "/images/hero/hero-homebase-totems.jpg" },
        { name: "HOMEBASE Entrance",              img: "/images/hero/hero-homebase-entrance.jpg" },
        { name: "Homebase Motif",                 img: "/images/homebase/homebase-motif-closeup.jpg" },
        { name: "Homebase Feature",               img: "/images/hero/hero-homebase-sculpture.jpg" },
        { name: "Homebase Feature",               img: `${CDN}/cffc33df-3d81-460f-b4aa-9f8adc9d81d8_rw_1200.jpg?h=b0a0ebd2ca83e06d7b56e5fbee049be2` },
        { name: "Homebase Feature",               img: `${CDN}/68de0a24-fad7-4ca7-815c-c69bc555e26b_rw_1200.jpg?h=3753bfa46bd85dbee8c3bfa404145296` },
        { name: "Fiona Stanley",                  img: `${CDN}/13dddf44-cb0a-4ad6-a4ac-3b229792d04d_rw_1920.jpg?h=0542d30e647f6e1d326dee723044be1b` },
        { name: "FIONA STANLEY TOTEMS",           img: `${CDN}/14c73030-575d-46e2-ae9e-eb407eb06e16_rw_1200.jpg?h=ba62f642a4afa2e84f7480801652c94e` },
        { name: "FIONA STANLEY TOTEMS",           img: `${CDN}/0bb31cda-116a-4ec4-8c20-5f25f900287c_rw_1200.jpg?h=bfcf87b6d12a3c5a71b0094e8fba92cd` },
        { name: "ORIAN Totem",                    img: `${CDN}/79a0816f-0847-4bb5-aa06-a9077f7db746_rw_1200.jpg?h=1fcf914a6813bdea5a959d6dc3a50086` },
        { name: "MARAKESH TRIO (Custom)",         img: "/images/hero/hero-marakesh-tall.jpg" },
        { name: "MARAKESH TRIO (Custom)",         img: `${CDN}/931545f6-0a20-4f80-8707-7f6367b77839_rw_1920.jpg?h=05a55b82c71d8324a6e4bf510a85b40a` },
        { name: "REVO Planter",                   img: `${CDN}/65b28727-1582-4a73-9cef-d8da2edcf885_rw_1200.jpg?h=dd868561cf5303ec36c515bbc0c7b736` },
      ],
    },
    {
      id: "public-3",
      label: "CULTURAL COMMISSIONS",
      items: [
        { name: "BENIN Inspired",     img: `${CDN}/e6796e77-b853-4fca-99ee-5915afe3f048_rw_1920.jpg?h=263b62acc4a3c578c5362e2ffad7d532` },
        { name: "MARAKESH TRIO",      img: `${CDN}/7242a044-526d-49ad-92f3-b6a74d6b0198_rw_1200.jpg?h=aed4aadb71807616895e7453440680b6` },
        { name: "RAVI Inspired",      img: `${CDN}/737c1792-472d-4328-9c28-1f74c7f49d95_rw_1920.jpg?h=d80df3f24ed7c830fa26da48c78684f6` },
        { name: "Unity in Diversity", img: `${CDN}/6745c491-3d3b-4501-b01c-76a351d2d9d1_rw_1920.jpeg?h=52cf56ba89edab095b94d025686dd55a` },
      ],
    },
    {
      id: "public-4",
      label: "MEMORIAL WORKS",
      items: [
        { name: "ORIAN Totem",     img: `${CDN}/79a0816f-0847-4bb5-aa06-a9077f7db746_rw_1200.jpg?h=1fcf914a6813bdea5a959d6dc3a50086` },
      ],
    },
    {
      id: "public-5",
      label: "CIVIC INSTALLATIONS",
      items: [
        { name: "ERGO",              img: `${CDN}/407aaa0c-2e00-4727-8033-fb2d4c493345_rw_1920.jpg?h=afa196b9d8ede40d7b62b4f0ba4aa48f`, pos: "left center" },
        { name: "GRAIL",             img: `${CDN}/bfb2cefd-e38d-4cbf-86cb-eb955a34f2f9_rw_3840.jpg?h=d8252802c5923b6c85bfbb1d48ffd3f4` },
        { name: "DANDELIONS Totems", img: `${CDN}/14c73030-575d-46e2-ae9e-eb407eb06e16_rw_1200.jpg?h=ba62f642a4afa2e84f7480801652c94e` },
        { name: "ASLYIAM",           img: `${CDN}/50c8fb4e-fa4f-459c-89a0-01fb69b9a875_rw_1920.jpg?h=df73cbda10ac29b35c6dc97ed20ff906` },
        { name: "VUELTA",            img: `${CDN}/1fcdb08d-cdb7-4792-8883-01100fee426d_rw_1200.jpg?h=9714e17c2c6817b7853e5c5b3572f750` },
        { name: "XAVIER",            img: `${CDN}/f3dc2b7b-8496-45da-9ff9-8bc4ba20e8f7_rw_1920.jpg?h=e6346e68c6fdfb984159856228b18dc4` },
      ],
    },
    {
      id: "public-6",
      label: "FIRE & LIGHT",
      items: [
        { name: "XAVIER",              img: `${CDN}/f3dc2b7b-8496-45da-9ff9-8bc4ba20e8f7_rw_1920.jpg?h=e6346e68c6fdfb984159856228b18dc4` },
        { name: "Fiona Stanley",       img: `${CDN}/13dddf44-cb0a-4ad6-a4ac-3b229792d04d_rw_1920.jpg?h=0542d30e647f6e1d326dee723044be1b` },
        { name: "HOMEBASE Fire Pit",   img: `${CDN}/b4fe3827-e371-4bd2-9bb5-1c0b3def3095_rw_1920.jpg?h=84f3b1d6bc18639679e471b3b23f418d` },
      ],
    },
    {
      id: "public-7",
      label: "CONCEPTS",
      items: [
        { name: "Percent for Art", img: `${CDN}/a017e095-21a4-41a4-bdd7-630bb270b4f3_rw_1200.jpg?h=b4276b4f7952052c0cdbc1db1526c232`, slides: [`${CDN}/a017e095-21a4-41a4-bdd7-630bb270b4f3_rw_1200.jpg?h=b4276b4f7952052c0cdbc1db1526c232`, `${CDN}/713bf242-7075-4082-90cd-c885aa129107_rw_1920.jpg?h=a51d01c9d949978e58515742c345cd34`] },
        { name: "Outback Info Bays",           img: `${CDN}/882272cb-30b0-4cef-8f0e-dee3241578e3_rw_1920.jpg?h=accf777e0802c55ffa064f37bb13befe` },
        { name: "Shire of Peel", img: `${CDN}/8157a7f2-763b-469d-bca4-dee47707d7da_rw_1920.jpg?h=8c83e1b4dca7446ea02465c6438a82e9`, slides: [`${CDN}/8157a7f2-763b-469d-bca4-dee47707d7da_rw_1920.jpg?h=8c83e1b4dca7446ea02465c6438a82e9`, `${CDN}/39f2b9a7-cf77-4a54-a88e-a92948a82ebe_rw_1920.jpg?h=9e5d420ad71060f91b222a0d11ac0a67`], videoUrl: "/videos/waroona.mp4" },
        { name: "Homebase Landscape Final Design", img: `/images/homebase-concept-final.jpg` },
        { name: "Homebase Landscape Design First Draft", img: `${CDN}/4fe97b52-7eca-4995-a9b0-e9caa6d72967_rw_1920.jpg?h=e8870627f871e657b986a401d62100fe` },
        { name: "Homebase Entrance Signage", img: `${CDN}/66a80833-aa96-4e7a-a62e-6ce882831573_rw_1200.jpg?h=b3a5cf5b979eb22dc56bd82cc14f5946` },
        { name: "Home Base",                   img: `${CDN}/ba29da64-778e-4e6c-a942-02acff420a19_rw_1200.jpg?h=c81199c62bdc877ac5244d0b3b22f17f` },
        { name: "Home Base Landscape",         img: `${CDN}/8aabcc1e-b8c3-45e3-aa3d-c56d5911ea03_rw_1920.jpg?h=142926ed21c731745b66587a99e4c8e0` },
        { name: "Home Base Landscape",         img: `${CDN}/3ef7ea8e-eec1-4856-b37a-f2d23978aca3_rw_1920.jpg?h=6ec1f7e1ff1f709ad73ac4e78cf30736` },
        { name: "Home Base Landscape",         img: `${CDN}/9422ac0b-5ce1-4cca-83fc-660e854c3bb0_rw_1200.jpg?h=3b92abcf4f65601c8e5cd9872c6e3121` },
        { name: "Home Base Landscape",         img: `${CDN}/04ac8236-413f-4590-a522-dfca01a94fe8_rw_1200.jpg?h=37ffcbb1ecba586da34b3acca113e525` },
        { name: "Centennial Park — Final Concept", img: `${CDN}/437cf607-c821-4331-8874-d47ecda32ca3_rw_1920.jpg?h=c750d85f1ffad919b8eeefcb3ecfb597` },
        { name: "Centennial Park — Concepts",  img: `${CDN}/8b43f372-e1ca-4882-b630-bc0d985db4a7_rw_1200.jpg?h=c300bdda09947b73eb5e16f3aa004970` },
        { name: "Cottesloe Residence",         img: `${CDN}/7c66f9e9-9682-4d93-8bb6-36aa19318e94_rw_1920.jpg?h=610337b8800e7a8f32bcb1e992b7da2e` },
        { name: "Cottesloe Residence",         img: `${CDN}/d8d96ede-c60e-4b48-991b-b80f157db3a5_rw_1920.jpg?h=3958d3517925745ac20a9c1ce75ff1c0` },
      ],
    },
  ],
  residential: [
    {
      id: "residential-1",
      label: "FEATURE WALLS",
      items: [
        { name: "RAVI Inspired",    img: `${CDN}/737c1792-472d-4328-9c28-1f74c7f49d95_rw_1920.jpg?h=d80df3f24ed7c830fa26da48c78684f6` },
        { name: "Homebase Feature", img: `${CDN}/68de0a24-fad7-4ca7-815c-c69bc555e26b_rw_1200.jpg?h=3753bfa46bd85dbee8c3bfa404145296` },
        { name: "CREEPING FIG",     img: `${CDN}/d2a97109-c3ab-4f3b-a219-3726bdcaa590_rw_1920.jpg?h=e19cb2a02fabf0399f96c89d0deaa24d` },
        { name: "VILLA LEAF",       img: `${CDN}/362f312d-4a16-4ba4-ab9d-8d199041a8cb_rw_1200.jpg?h=27aeb398ec72a746b071f1d103ea59f4` },
        { name: "KYRA LEAF",        img: `${CDN}/5ba61f7c-c0d7-4036-93d5-d85abdbbb7c6_rw_1200.jpg?h=57e46a88f708de0ed6a2c1436189e0b0` },
      ],
    },
    {
      id: "residential-2",
      label: "FIRE & LIGHT",
      items: [
        { name: "HOMEBASE Fire Pit", img: `${CDN}/b4fe3827-e371-4bd2-9bb5-1c0b3def3095_rw_1920.jpg?h=84f3b1d6bc18639679e471b3b23f418d` },
        { name: "REEDS of UNGARO",  img: `${CDN}/b03ec13b-fba3-432f-9723-3f646b508054_rw_1920.jpg?h=418827879ce9e3c033d8eee6e975b2c4` },
        { name: "URCHIN",           img: `${CDN}/4abdd8f3-44a5-4a24-b6cb-ccdb233b297e_rw_1920.jpeg?h=b6df39c4e5d452fcf8293dc8052d0399` },
        { name: "YAZAD Fire",       img: `${CDN}/a9ffceab-afdf-47d9-8ba1-53687b469ec4_rw_1200.jpg?h=9e83085238f9a77b3e2d2ed447431717` },
        { name: "EQUISETTI",        img: `${CDN}/453b1942-6be0-4365-b111-0affe46a048e_rw_1920.jpg?h=968dc8dad1b2ec3603236a03c95526df` },
        { name: "ORIAN Totem",      img: `${CDN}/79a0816f-0847-4bb5-aa06-a9077f7db746_rw_1200.jpg?h=1fcf914a6813bdea5a959d6dc3a50086` },
        { name: "LUCARIO",          img: `${CDN}/dfb5f9eb-ba6e-4863-9a8f-e75c77d22339_rw_1200.jpg?h=040e8d1a3bc81a9e3a71209f6979b222` },
        { name: "VAYA",             img: `${CDN}/2bcd6fe0-699f-4525-b006-5063523f80f3_rw_1200.jpg?h=4e39c5a0962b339fced048fdb6373d5f` },
        { name: "BENIN Inspired",   img: `${CDN}/e6796e77-b853-4fca-99ee-5915afe3f048_rw_1920.jpg?h=263b62acc4a3c578c5362e2ffad7d532` },
        { name: "RAVI Inspired",    img: `${CDN}/737c1792-472d-4328-9c28-1f74c7f49d95_rw_1920.jpg?h=d80df3f24ed7c830fa26da48c78684f6` },
      ],
    },
    {
      id: "residential-3",
      label: "GARDEN SCULPTURES",
      items: [
        { name: "ORIAN Totem", img: `${CDN}/79a0816f-0847-4bb5-aa06-a9077f7db746_rw_1200.jpg?h=1fcf914a6813bdea5a959d6dc3a50086` },
        { name: "MARAKESH",    img: "/images/hero/hero-marakesh-tall.jpg" },
        { name: "YAZAD",       img: `${CDN}/a9ffceab-afdf-47d9-8ba1-53687b469ec4_rw_1200.jpg?h=9e83085238f9a77b3e2d2ed447431717` },
      ],
    },
    {
      id: "residential-4",
      label: "ENTRY & GATES",
      items: [
        { name: "URO",     img: "/images/screens/uro-milvain.jpg" },
        { name: "ERGO",    img: `${CDN}/407aaa0c-2e00-4727-8033-fb2d4c493345_rw_1920.jpg?h=afa196b9d8ede40d7b62b4f0ba4aa48f`, pos: "left center" },
        { name: "GRAIL",   img: `${CDN}/bfb2cefd-e38d-4cbf-86cb-eb955a34f2f9_rw_3840.jpg?h=d8252802c5923b6c85bfbb1d48ffd3f4` },
        { name: "FERLIE",  img: `${CDN}/a8f3ce2e-c51d-47fa-bbee-4563523ef01a_rw_1920.jpg?h=8ed539c980ba51543bf04a555b8b5e93` },
        { name: "LUCARIO", img: `${CDN}/dfb5f9eb-ba6e-4863-9a8f-e75c77d22339_rw_1200.jpg?h=040e8d1a3bc81a9e3a71209f6979b222` },
        { name: "VAYA",    img: `${CDN}/2bcd6fe0-699f-4525-b006-5063523f80f3_rw_1200.jpg?h=4e39c5a0962b339fced048fdb6373d5f` },
      ],
    },
    {
      id: "residential-5",
      label: "INTERIOR PANELS",
      items: [
        { name: "GRAIL",         img: `${CDN}/bfb2cefd-e38d-4cbf-86cb-eb955a34f2f9_rw_3840.jpg?h=d8252802c5923b6c85bfbb1d48ffd3f4` },
        { name: "ASLYIAM",       img: `${CDN}/50c8fb4e-fa4f-459c-89a0-01fb69b9a875_rw_1920.jpg?h=df73cbda10ac29b35c6dc97ed20ff906` },
        { name: "WATTLE",        img: `${CDN}/4f9d07e7-a1ba-4215-b4ed-86dee879d606_rw_600.jpg?h=98b5087c0cadf4a5f192beb793d55296` },
        { name: "LUMIER",        img: `${CDN}/65df5eb8-8965-49e7-a31c-9fdd5db80da9_rw_1200.jpg?h=8fa0436374c48082a687a93785e8c28e` },
        { name: "MARAKESH TRIO", img: `${CDN}/931545f6-0a20-4f80-8707-7f6367b77839_rw_1920.jpg?h=05a55b82c71d8324a6e4bf510a85b40a` },
        { name: "HOMEBASE — Landscape design and features", img: `${CDN}/8aabcc1e-b8c3-45e3-aa3d-c56d5911ea03_rw_1920.jpg?h=142926ed21c731745b66587a99e4c8e0` },
      ],
    },
    {
      id: "residential-7",
      label: "CUSTOM SCREENS",
      items: [
        { name: "Unity in Diversity", img: `${CDN}/6745c491-3d3b-4501-b01c-76a351d2d9d1_rw_1920.jpeg?h=52cf56ba89edab095b94d025686dd55a` },
        { name: "CUSTOM", img: "/images/screens/hollingworth-1.jpg", slides: ["/images/screens/hollingworth-1.jpg", "/images/screens/hollingworth-2.jpg"] },
      ],
    },
    {
      id: "residential-6",
      label: "PLANTERS",
      items: [
        { name: "HOMEBASE Totems", img: "/images/hero/hero-homebase-totems.jpg" },
        { name: "EVO",             img: `${CDN}/35a4cd54-797e-43c5-9e58-40f7c00f5964_rw_1200.jpg?h=035d1b71d4a9d1017e300158140164f1` },
        { name: "HOMEBASE Motif Sculpture", img: `${CDN}/b32ea229-d756-4e86-9f8e-ddd64ab25e66_rw_1200.jpg?h=11202a4f895ca6ffb66c1ea982364b6c` },
        { name: "ERGO — Cottesloe Hotel",  img: `${CDN}/9ea86aef-4d28-4b92-bb98-5293deef8c93_rw_3840.jpg?h=0eaa14f335accdf89ebd50e55234a8fd`, slides: [`${CDN}/9ea86aef-4d28-4b92-bb98-5293deef8c93_rw_3840.jpg?h=0eaa14f335accdf89ebd50e55234a8fd`, `${CDN}/ff393903-5912-40da-9b37-aca22ef599b4_rw_1920.jpg?h=1ef862e9145edcf101d46bcd4a02fb15`] },
        { name: "ZARATHSTRA — Helvetica Bar", img: "/images/zarathstra/helvetica-bar.jpg" },
      ],
    },
  ],
};

const TABS = [
  { id: "commercial",  label: "Commercial" },
  { id: "public",      label: "Public" },
  { id: "residential", label: "Residential" },
];

const ALL_SERIES = [
  ...COMMISSIONS.commercial,
  ...COMMISSIONS.public,
  ...COMMISSIONS.residential,
];

function getBySeriesIds(ids) {
  return ids.flatMap(id => ALL_SERIES.find(s => s.id === id)?.items ?? []);
}

const CATEGORY_FILTERS = [
  { id: "sculpture",  label: "Sculpture",   seriesIds: ["public-2", "residential-3"] },
  { id: "screens",    label: "Screens",      seriesIds: ["commercial-2", "residential-4", "residential-5", "residential-7"] },
  { id: "fire-light", label: "Fire & Light", seriesIds: ["commercial-5", "residential-2", "public-6"] },
  { id: "planters",   label: "Planters",     seriesIds: ["residential-6"] },
  { id: "projects",   label: "Projects",     seriesIds: ["commercial-6"], allTabs: true },
  { id: "concepts",   label: "Concepts",     seriesIds: ["public-7"], allTabs: true },
];

export const SCULPTURE_ITEMS = (() => {
  const seriesIds = ["public-2", "residential-3"];
  const seen = new Set();
  const items = ALL_SERIES
    .filter(s => seriesIds.includes(s.id))
    .flatMap(s => s.items)
    .filter(item => { if (seen.has(item.img)) return false; seen.add(item.img); return true; });
  return items;
})();

export const CONCEPTS_ITEMS = (() => {
  const seen = new Set();
  return ALL_SERIES
    .filter(s => s.id === "public-7")
    .flatMap(s => s.items)
    .filter(item => { if (seen.has(item.img)) return false; seen.add(item.img); return true; });
})();

// ── Debug label overlay — set to false to remove ─────────────────────────
const DEBUG_LABELS = false;

// Manually assigned codes + aspects per image (tab + category + descriptive aspects)
const _manualCodes = {
  [`${CDN}/407aaa0c-2e00-4727-8033-fb2d4c493345_rw_1920.jpg?h=afa196b9d8ede40d7b62b4f0ba4aa48f`]: { tabs: "R", cats: "S", aspects: "Framed Divider, Display Home" },
  [`${CDN}/cffc33df-3d81-460f-b4aa-9f8adc9d81d8_rw_1200.jpg?h=b0a0ebd2ca83e06d7b56e5fbee049be2`]: { tabs: "P", cats: "SCU", aspects: "Homebase Feature" },
  [`${CDN}/65df5eb8-8965-49e7-a31c-9fdd5db80da9_rw_1200.jpg?h=8fa0436374c48082a687a93785e8c28e`]: { tabs: "C P R", cats: "S", aspects: "R5·I4 — LUMIER · Promotional Image · Divider" },
  [`${CDN}/f3dc2b7b-8496-45da-9ff9-8bc4ba20e8f7_rw_1920.jpg?h=e6346e68c6fdfb984159856228b18dc4`]: { tabs: "P", cats: "S", aspects: "HIA Show Display, Sydney · Rollingstone Landscapes · Winning Display" },
  [`${CDN}/bfb2cefd-e38d-4cbf-86cb-eb955a34f2f9_rw_3840.jpg?h=d8252802c5923b6c85bfbb1d48ffd3f4`]: { tabs: "R", cats: "S", aspects: "R5·I1 — GRAIL · Divider, Privacy Screen" },
  [`${CDN}/a8f3ce2e-c51d-47fa-bbee-4563523ef01a_rw_1920.jpg?h=8ed539c980ba51543bf04a555b8b5e93`]: { tabs: "R", cats: "S", aspects: "Room Divider, Display Home" },
  [`${CDN}/dfb5f9eb-ba6e-4863-9a8f-e75c77d22339_rw_1200.jpg?h=040e8d1a3bc81a9e3a71209f6979b222`]: { tabs: "R", cats: "S", aspects: "Wall Decor, Stainless Steel 316" },
  [`${CDN}/f158bc26-4f22-47d2-bee1-ba39cc74113e_rw_1200.jpg?h=9b291706b6c76ce980996749ddcac948`]: { tabs: "R", cats: "S", aspects: "Room Divider, Display Home" },
  [`${CDN}/4f9d07e7-a1ba-4215-b4ed-86dee879d606_rw_600.jpg?h=98b5087c0cadf4a5f192beb793d55296`]: { tabs: "R", cats: "S", aspects: "R5·I3 — WATTLE · Custom feature for TDL" },
  [`${CDN}/1fcdb08d-cdb7-4792-8883-01100fee426d_rw_1200.jpg?h=9714e17c2c6817b7853e5c5b3572f750`]: { tabs: "C P R", cats: "S", aspects: "Promotional Image" },
  [`${CDN}/764a0e79-ff27-475c-9d20-83c1d9eb75df_rw_1200.jpg?h=9d3184e28d977bc2302e1257338e6202`]: { tabs: "R", cats: "S", aspects: "Fence Infill, Aquilla Homes" },
  [`${CDN}/50c8fb4e-fa4f-459c-89a0-01fb69b9a875_rw_1920.jpg?h=df73cbda10ac29b35c6dc97ed20ff906`]: { tabs: "C P R", cats: "S", aspects: "R5·I2 — ASLYIAM · Promotional Image" },
  [`${CDN}/1a26b497-b278-4edc-a050-a2b42e3718d4_rw_1200.jpg?h=c9c84b6bfadb268cbc11d45d092376b6`]: { tabs: "R", cats: "S LF", aspects: "Prentise Adams" },
  [`${CDN}/5387f1db-afbb-40f2-9e31-b1fcdf5163a5_rw_600.jpg?h=7534bc99219be8c316a514e9aa4d53d9`]: { tabs: "R", cats: "S LF", aspects: "Custom cellar door with perspex, Light Feature" },
  ["/images/aslyiam/aslyiam-diamond-nails.jpg"]: { tabs: "C", cats: "S", aspects: "Window Feature, 1×4m" },
  [`${CDN}/18320e7a-11d9-401e-be88-2882883feca6_rw_1920.jpg?h=4b46a811c317a0c4c6d1371ba030aba1`]: { tabs: "R", cats: "S", aspects: "Framed Divider Screen, Display Home" },
  [`${CDN}/a7051a98-18b5-4a76-bf4f-f9569636a04b_rw_1200.jpg?h=f0f12a678192c73ee2eb9f303da0c70e`]: { tabs: "C P R", cats: "S", aspects: "Promotional Image · Apartment Entrance Gates, Security Door" },
  [`${CDN}/9ea86aef-4d28-4b92-bb98-5293deef8c93_rw_3840.jpg?h=0eaa14f335accdf89ebd50e55234a8fd`]: { tabs: "C", cats: "S", aspects: "R6·I4 — ERGO · Cottesloe Hotel · Gates · Fences · Screens · McDonald Jones Architects" },
  [`${CDN}/8e870d8c-8b02-4a6a-82b2-7aed7fc22c83_rw_1920.jpg?h=6b581f0dca9b07bc0e4238973f68d875`]: { tabs: "C", cats: "S", aspects: "Fencing" },
  [`${CDN}/5d641ee3-f68a-46f0-836e-a439215cb153_rw_1200.jpg?h=2e876a49c3a095d458f3147933679842`]: { tabs: "R", cats: "S", aspects: "Room Divider" },
  [`${CDN}/e6796e77-b853-4fca-99ee-5915afe3f048_rw_1920.jpg?h=263b62acc4a3c578c5362e2ffad7d532`]: { tabs: "R", cats: "S", aspects: "Custom" },
  [`${CDN}/737c1792-472d-4328-9c28-1f74c7f49d95_rw_1920.jpg?h=d80df3f24ed7c830fa26da48c78684f6`]: { tabs: "R", cats: "S", aspects: "Custom" },
  [`${CDN}/6745c491-3d3b-4501-b01c-76a351d2d9d1_rw_1920.jpeg?h=52cf56ba89edab095b94d025686dd55a`]: { tabs: "P", cats: "SCU LF", aspects: "R7·I1 — Unity in Diversity · Centennial Park" },
  ["/images/hero/hero-homebase-totems.jpg"]: { tabs: "C P", cats: "SCU", aspects: "R6·I1 — HOMEBASE Totems" },
  [`${CDN}/b32ea229-d756-4e86-9f8e-ddd64ab25e66_rw_1200.jpg?h=11202a4f895ca6ffb66c1ea982364b6c`]: { tabs: "C P", cats: "SCU LF", aspects: "R6·I3 — HOMEBASE Motif Sculpture" },
  ["/images/zarathstra/helvetica-bar.jpg"]: { tabs: "C", cats: "S", aspects: "R6·I5 — ZARATHSTRA · Helvetica Bar · Divider" },
  [`${CDN}/35a4cd54-797e-43c5-9e58-40f7c00f5964_rw_1200.jpg?h=035d1b71d4a9d1017e300158140164f1`]: { tabs: "C P R", cats: "PL LF", aspects: "R6·I2 — EVO · HOMEBASE · landscape design and features" },
  [`${CDN}/4abdd8f3-44a5-4a24-b6cb-ccdb233b297e_rw_1920.jpeg?h=b6df39c4e5d452fcf8293dc8052d0399`]: { tabs: "C P", cats: "LF", aspects: "R15 — URCHIN · Light Feature · HOMEBASE · landscape design and features" },
  [`${CDN}/0bb31cda-116a-4ec4-8c20-5f25f900287c_rw_1200.jpg?h=bfcf87b6d12a3c5a71b0094e8fba92cd`]: { tabs: "P", cats: "SCU LF", aspects: "R10·I1 — Fiona Stanley · indigenous motif Totems" },
  [`${CDN}/4605043d-cb34-4ade-9339-8d8bd07645a4_rw_1200.jpg?h=fca4113e721c1c7e73ce20ae5e67de4f`]: { tabs: "C P", cats: "SCU LF", aspects: "R10·I2 — HOMEBASE Signage Totems" },
  [`${CDN}/181378db-3310-4b32-8704-00836f3e0cc8_rw_1200.jpg?h=52a90c81fceb55de4efa45dafc489df8`]: { tabs: "C P", cats: "PL", aspects: "EVO Planters · HOMEBASE" },
  [`${CDN}/3826640c-6476-446d-b49c-ba7d1e312544_rw_1200.jpg?h=c0d5d10fff0b19393f91086df8643610`]: { tabs: "C P", cats: "PL", aspects: "EVO Planters · HOMEBASE" },
  [`${CDN}/931545f6-0a20-4f80-8707-7f6367b77839_rw_1920.jpg?h=05a55b82c71d8324a6e4bf510a85b40a`]: { tabs: "C P R", cats: "SCU", aspects: "MARAKESH TRIO · customised entrance feature" },
  [`${CDN}/8aabcc1e-b8c3-45e3-aa3d-c56d5911ea03_rw_1920.jpg?h=142926ed21c731745b66587a99e4c8e0`]: { tabs: "C P", cats: "S LF SCU", aspects: "R5·I6 — HOMEBASE · Landscape design and features" },
};

const _debugMap = (() => {
  const catLabel = { sculpture: "SCU", screens: "S", "fire-light": "FL", planters: "PL", projects: "PRJ", concepts: "CON" };
  const tabLabel = { commercial: "C", public: "P", residential: "R" };
  const bySeries = {};
  CATEGORY_FILTERS.forEach(c => c.seriesIds.forEach(sid => {
    (bySeries[sid] = bySeries[sid] || []).push(catLabel[c.id] || c.id.toUpperCase());
  }));
  const m = new Map();
  // Aggregate ALL series for each image (same image can appear in multiple tabs/categories)
  Object.entries(COMMISSIONS).forEach(([tid, sarr]) => {
    sarr.forEach(s => {
      s.items.forEach(item => {
        const tl = tabLabel[tid];
        const cats = bySeries[s.id] || [];
        if (!m.has(item.img)) {
          m.set(item.img, { tabs: new Set([tl]), cats: new Set(cats) });
        } else {
          const e = m.get(item.img);
          e.tabs.add(tl);
          cats.forEach(c => e.cats.add(c));
        }
      });
    });
  });
  m.forEach((v, k) => m.set(k, { tabs: [...v.tabs].join(' '), cats: [...v.cats].join(' ') }));
  return m;
})();

const SCREENS_MARQUEE_IMGS = [
  "/images/screens/strip/aslyiam.jpg",
  "/images/screens/strip/ferlie-close.jpg",
  "/images/screens/strip/grail-close.jpg",
  "/images/screens/strip/marakesh-fdl.jpg",
  "/images/screens/strip/wattle-urn.jpg",
  "/images/screens/strip/wattle.jpg",
  "/images/screens/strip/xavier-close.jpg",
];

// ── Screens feature slideshow — edit slides here ──────────────────────────────
// Each slide: img (path), heading, subheading, body (optional text lines)
// Animation text per slide goes here — James will populate these
const SCREENS_SLIDESHOW_SLIDES = [
  {
    img: "/images/screens/viasi-mt-lawley-day.jpg",
    heading: "VIASI",
    subheading: "Mt Lawley — Fence Infills & Entry Gate",
    body: "",
  },
  {
    img: "/images/screens/ergo-display-home.jpg",
    heading: "ERGO",
    subheading: "Display Home Interior",
    body: "",
  },
  {
    img: "/images/screens/ergo-cottesloe-gate.jpg",
    heading: "ERGO",
    subheading: "Cottesloe Hotel — Gate",
    body: "",
    objectPosition: "center 85%",
  },
  {
    img: "/images/screens/ergo-fence-northstead.jpg",
    heading: "ERGO",
    subheading: "Fence Infills & Balustrade — Northstead",
    body: "",
    objectPosition: "center 70%",
  },
  {
    img: "/images/screens/homebase-display-2.jpg",
    heading: "HOMEBASE",
    subheading: "Homebase Display — TVC 2015",
    body: "",
    objectPosition: "center 20%",
  },
  {
    img: "/images/screens/eros-pergola-williamstown.jpg",
    heading: "EROS",
    subheading: "Pergola — Williamstown",
    body: "",
    objectPosition: "center 20%",
  },
];

function ScreensStoryModal({ onClose }) {
  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 9000, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: "#111", width: "min(500px, 92vw)", maxHeight: "90vh", overflowY: "auto", scrollbarWidth: "none", position: "relative", border: "1px solid rgba(242,240,233,0.07)", display: "flex", flexDirection: "column" }}
      >
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "rgba(242,240,233,0.35)", cursor: "pointer", fontSize: 18, lineHeight: 1, zIndex: 2 }}>✕</button>

        {/* Spiel header image */}
        <div style={{ position: "relative", width: "100%", height: 200, overflow: "hidden", flexShrink: 0 }}>
          <img src="/images/screens/spiel-poster.jpg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center center", display: "block" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.35)" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ display: "block", width: 60, height: "1.5px", background: "rgba(242,240,233,0.35)" }} />
                <span style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "clamp(18px, 3.5vw, 26px)", letterSpacing: "0.06em", color: "rgba(242,240,233,0.85)", whiteSpace: "nowrap" }}>The Art Form</span>
                <span style={{ display: "block", width: 60, height: "1.5px", background: "rgba(242,240,233,0.35)" }} />
              </div>
              <p style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "clamp(18px, 3.5vw, 26px)", margin: 0, lineHeight: 1.05, letterSpacing: "0.06em", textAlign: "center" }}>
                <span style={{ color: "rgba(242,240,233,0.32)" }}>Shadows </span><span style={{ color: "rgba(242,240,233,0.55)" }}>& </span><span style={{ color: "rgba(242,240,233,0.9)" }}>Light</span>
              </p>
            </div>
          </div>
        </div>

        {/* Body text */}
        <div style={{ padding: "36px 40px 44px", display: "flex", flexDirection: "column", gap: 20 }}>
          <p style={{ fontFamily: "var(--font-detail)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(242,240,233,0.65)", lineHeight: 1.9, margin: 0, textAlign: "center" }}>
            For three thousand years, humanity has shaped shadows with form and light — honing the ancient craft of screens.
          </p>
          {[
            "From the woven reeds of ancient Egypt to the carved lattices of Mesopotamian palaces — screens were never merely functional. They were a language. One that spoke of shelter and mystery, of the threshold between public and private, of shadow and adornment made beautiful.",
            "The Islamic Golden Age gave that language its most eloquent voice — breathtaking geometric complexity that turned a wall into a meditation, a doorway into an experience. It rippled through Medieval Europe, through the courts of Asia, through the ornate ironwork of the Victorian colonial era.",
            "Then came the machine. Laser and CNC technology did not replace the craft — they set it free. Suddenly the organic, the intricate, the impossibly fine became possible in aluminium, steel, timber and stone.",
            "ROGETjames occupies this space today — drawing on the depth of that lineage, bringing new thinking and original design into one of the oldest crafts in the built world with contemporary precision.",
          ].map((para, i) => (
            <p key={i} style={{ fontFamily: "var(--font-detail)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(242,240,233,0.65)", lineHeight: 1.9, margin: 0, textAlign: "center" }}>
              {para}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

function ScreensFeatureSlideshow() {
  const [cur, setCur] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [storyOpen, setStoryOpen] = useState(false);
  const timerRef = useRef(null);

  const _goTo = (idx) => {
    if (animating || idx === cur) return;
    setAnimating(true);
    setTimeout(() => { setCur(idx); setAnimating(false); }, 500);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCur(p => (p + 1) % SCREENS_SLIDESHOW_SLIDES.length);
        setAnimating(false);
      }, 500);
    }, 4500);
    return () => clearInterval(timerRef.current);
  }, []);

  const slide = SCREENS_SLIDESHOW_SLIDES[cur];

  return (
    <div style={{ gridColumn: "1 / -1", margin: "8px 0 32px 0", position: "relative", height: "420px", borderRadius: "12px", overflow: "hidden", background: "#111" }}>
      {/* Slide image */}
      {SCREENS_SLIDESHOW_SLIDES.map((s, i) => (
        <img
          key={i}
          src={s.img}
          alt={s.heading}
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover",
            objectPosition: s.objectPosition || "center center",
            opacity: i === cur ? (animating ? 0 : 1) : 0,
            transition: "opacity 0.5s ease",
          }}
        />
      ))}

      {/* Gradient overlay */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)" }} />

      {/* Text content — animate/edit per slide here */}
      <div style={{
        position: "absolute", left: 48, top: "50%", transform: "translateY(-50%)",
        opacity: animating ? 0 : 1, transition: "opacity 0.45s ease",
        display: "flex", flexDirection: "column", gap: 10,
      }}>
        {slide.subheading && (
          <p style={{ fontFamily: "var(--font-detail)", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(242,240,233,0.55)", margin: 0 }}>
            {slide.subheading}
          </p>
        )}
        <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "clamp(16px, 2.5vw, 28px)", letterSpacing: "0.06em", color: "rgba(242,240,233,0.6)", margin: 0, lineHeight: 1 }}>
          {slide.heading}
        </h2>
        {slide.body && (
          <p style={{ fontFamily: "var(--font-detail)", fontSize: 14, color: "rgba(242,240,233,0.7)", maxWidth: 360, margin: 0, lineHeight: 1.6 }}>
            {slide.body}
          </p>
        )}
      </div>

      {/* Slide counter */}
      <p style={{ position: "absolute", bottom: 22, right: 24, fontFamily: "var(--font-detail)", fontSize: 11, color: "rgba(242,240,233,0.4)", letterSpacing: "0.12em", margin: 0 }}>
        {String(cur + 1).padStart(2, "0")} / {String(SCREENS_SLIDESHOW_SLIDES.length).padStart(2, "0")}
      </p>

      {/* Category tags */}
      <div style={{ position: "absolute", bottom: 20, left: 0, right: 0, display: "flex", justifyContent: "center", padding: "0 32px" }}>
        <p style={{ fontFamily: "var(--font-detail)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#F2F0E9", margin: 0, textAlign: "center", lineHeight: 1.8 }}>
          Wall Decor · Entrance Gates · Security Gates Automated · Fencing · Infills · Dividers · Privacy Screens · Awnings · Light Features
        </p>
      </div>

      {/* Story button */}
      <div style={{ position: "absolute", top: 20, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <button
          onClick={() => setStoryOpen(true)}
          className="pill-trace"
          style={{
            fontFamily: "var(--font-detail)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase",
            color: "rgba(242,240,233,0.7)", background: "rgba(0,0,0,0.35)", border: "1px solid rgba(242,240,233,0.18)",
            borderRadius: 9999, padding: "9px 22px", cursor: "pointer",
          }}
        >
          THE ART OF SHADOWS AND LIGHT
        </button>
      </div>

      {storyOpen && <ScreensStoryModal onClose={() => setStoryOpen(false)} />}
    </div>
  );
}

const SCREEN_DESIGNS = [
  // ── THE ICONS (A–Z) ───────────────────────────────────────────────────────
  {
    name: "ASLYIAM", sectionStart: "THE ICONS",
    items: [
      { name: "ASLYIAM",               img: `${CDN}/50c8fb4e-fa4f-459c-89a0-01fb69b9a875_rw_1920.jpg?h=df73cbda10ac29b35c6dc97ed20ff906` },
      { name: "ASLYIAM Light Feature", img: `${CDN}/1a26b497-b278-4edc-a050-a2b42e3718d4_rw_1200.jpg?h=c9c84b6bfadb268cbc11d45d092376b6` },
      { name: "ASLYIAM",               img: `${CDN}/bb795500-d407-424b-bc89-a099f1c7a24f_rw_1200.jpg?h=8e9a430ab9e013cb93c22ff9eee8bbf1` },
      { name: "ASLYIAM",               img: `${CDN}/90166d8d-2652-40c1-8b4f-b0c9a35778af_rw_1200.jpg?h=e2bcc6fd02f22feb1cb854a01b92edd6` },
      { name: "ASLYIAM", img: `${CDN}/783b12fc-1521-44f3-afa8-17b4f1a5e85c_rw_1200.jpg?h=cb9e3037dd77b8e2d3c97d74be6d26a3`, slides: [`${CDN}/783b12fc-1521-44f3-afa8-17b4f1a5e85c_rw_1200.jpg?h=cb9e3037dd77b8e2d3c97d74be6d26a3`, `${CDN}/f9a69d89-d090-4620-ad47-1569381a5503_rw_1200.jpg?h=3866430cb2cea125707a7fa520643511`] },
    ],
  },
  {
    name: "LUCARIO",
    tabs: ["icons", "classics"],
    tags: ["dividers"],
    items: [
      { name: "LUCARIO", img: `${CDN}/bf29f83d-b73c-4e2e-89b6-bc0f97489251_rw_1200.jpg?h=14760b1b7861b96fcd169589b4502375`, slides: [`${CDN}/bf29f83d-b73c-4e2e-89b6-bc0f97489251_rw_1200.jpg?h=14760b1b7861b96fcd169589b4502375`, `${CDN}/dfb5f9eb-ba6e-4863-9a8f-e75c77d22339_rw_1200.jpg?h=040e8d1a3bc81a9e3a71209f6979b222`] },
      { name: "LUCARIO TDL Landscapes", img: `${CDN}/586176b6-66ff-45c4-afd7-59eaa3da6181_rw_1920.jpg?h=1fdc57bf31de4ee143ede71bd0c67000` },
      { name: "LUCARIO Dividers",       img: `${CDN}/0176062d-e9cc-4ed6-8b71-cb1b361b688b_rw_1200.jpg?h=82ffcd703f42993bb7c3e6dd7aab5097` },
      { name: "LUCARIO",                img: `${CDN}/d8769e63-8cec-44d3-991f-cee986bc6360_rw_1200.jpg?h=7c86ee743c54e186716b78dfa444a7b0` },
      { name: "LUCARIO",                img: `${CDN}/35fe8b17-6414-4ac4-bc5d-977e3feb1ac2_rw_1200.jpg?h=f8d2e28e489fd4def037de6e3238a342` },
    ],
  },
  {
    name: "ROANDER",
    tabs: ["icons", "classics"],
    items: [
      { name: "ROANDER", img: "/images/roander/roander-1.jpg", pos: "20% center" },
      { name: "ROANDER", img: `${CDN}/b6751fc7-b7c7-4f41-b84d-bb501d184e62_rw_1920.jpg?h=f7b72bb2225da621cb88b5f39d807128`, slides: [`${CDN}/b6751fc7-b7c7-4f41-b84d-bb501d184e62_rw_1920.jpg?h=f7b72bb2225da621cb88b5f39d807128`, `${CDN}/f5e2a05d-f862-4427-983a-bfd5b700a9e2_rw_1200.jpg?h=64f7c9b00b72b14ce84324bfec45f501`, `${CDN}/8f61889e-8e26-41b7-9f63-af05771238f7_rw_1200.jpg?h=998d23059389bed8e8faf2db6688e930`] },
    ],
  },
  {
    name: "VIASI",
    tabs: ["icons", "organics"],
    items: [
      { name: "VIASI", img: `${CDN}/db223306-7723-48dc-a4e6-df471493fab8_rw_1920.jpg?h=e86d70e2edecf6bdebf5439f4e8b3ff1`, tags: ["light features", "residential", "display homes"] },
      { name: "VIASI", img: `${CDN}/8dd14241-86af-4d62-8a14-6987e02de827_rw_1920.jpg?h=cd5a2fd56e11e1c9c484c6a980076d2c`, tags: ["fencing", "gates", "residential"] },
      { name: "VIASI", img: `${CDN}/37079841-e329-43a9-81ab-614b04773986_rw_1200.jpg?h=b0b82fee2966850370f0202d2b239fa6`, slides: [`${CDN}/37079841-e329-43a9-81ab-614b04773986_rw_1200.jpg?h=b0b82fee2966850370f0202d2b239fa6`, `${CDN}/6bac8b33-cc48-4d67-ad5e-f4f6de63ebf5_rw_1200.jpg?h=622f77e992840504e4953ea8ab835917`, `${CDN}/1d4392ab-4a58-4537-b7ce-9fb1823860dd_rw_1200.jpg?h=4d48f1a728ace37d93dfe6ed782da3b0`], tags: ["fencing", "gates", "residential"] },
      { name: "VIASI", img: "/images/viasi/viasi-1.jpg", tags: ["fencing", "gates", "residential"] },
      { name: "VIASI", img: "/images/viasi/viasi-3.jpg", tags: ["fencing", "gates", "residential"] },
      { name: "VIASI", img: "/images/viasi/viasi-4.jpg", tags: ["fencing", "gates", "residential"] },
    ],
  },

  // ── THE ARCHITECTURAL (A–Z) ───────────────────────────────────────────────
  { name: "ELLE", sectionStart: "THE ARCHITECTURAL", tabs: ["architectural"], items: [
    { name: "ELLE — Corten Screen", img: "/images/screens/elle-corten.jpg", tags: ["screens", "residential"] },
  ] },
  { name: "CHIOLA", items: [
    { name: "CHIOLA",                       img: `${CDN}/a7051a98-18b5-4a76-bf4f-f9569636a04b_rw_1200.jpg?h=f0f12a678192c73ee2eb9f303da0c70e`, tags: ["gates", "residential"] },
    { name: "CHIOLA — Display Home",        img: "/images/chiola/chiola-display-home.jpg", description: "CHIOLA as room divider and window feature in a display home", tags: ["dividers", "residential", "display homes"] },
  ] },
  {
    name: "ERGO",
    tabs: ["icons", "architectural"],
    items: [
      { name: "ERGO Cottesloe Hotel", img: `${CDN}/9ea86aef-4d28-4b92-bb98-5293deef8c93_rw_3840.jpg?h=0eaa14f335accdf89ebd50e55234a8fd`, tags: ["divider", "commercial"] },
      { name: "ERGO Cottesloe Hotel", img: `${CDN}/ff393903-5912-40da-9b37-aca22ef599b4_rw_1920.jpg?h=1ef862e9145edcf101d46bcd4a02fb15`, tags: ["commercial", "gates"] },
      { name: "ERGO",                 img: `${CDN}/407aaa0c-2e00-4727-8033-fb2d4c493345_rw_1920.jpg?h=afa196b9d8ede40d7b62b4f0ba4aa48f`, pos: "left center", tags: ["divider", "residential", "display homes"] },
      { name: "ERGO",                 img: `${CDN}/e3107b10-9669-4608-a72a-6f3d1c796cae_rw_1200.jpg?h=d3036c7365cb87dedf9744bafde6b58e`, tags: ["fencing", "residential"] },
      { name: "ERGO",                 img: `${CDN}/52906986-dcb0-493a-b84b-508165599d56_rw_3840.jpg?h=77cb7699f9fd4483f4d28fa6ac93d98d`, tags: ["fencing", "balustrade", "residential"] },
      { name: "ERGO — Residential",  img: "/images/ergo/ergo-residential.jpg", description: "ERGO residential entrance gates and screen panels", tags: ["fencing", "gates", "residential"] },
      { name: "ERGO",                 img: "/images/screens/ergo-display-home.jpg", pos: "right center", tags: ["divider", "residential", "display homes"] },
    ],
  },
  {
    name: "CUSTOM",
    items: [
      { name: "CUSTOM", img: `${CDN}/0c753703-bc6a-444c-ba4e-b7983f836b30_rw_1200.jpg?h=bc14b842b86f3b6939b00809879a3373`, tags: ["gates", "residential"] },
      { name: "CUSTOM — Hollingworth", img: "/images/custom/custom-hollingworth-1.jpg", tags: ["fencing", "gates", "residential"] },
      { name: "CUSTOM — Hollingworth", img: "/images/custom/custom-hollingworth-2.jpg", tags: ["fencing", "gates", "residential"] },
    ],
  },
  {
    name: "EROS",
    items: [
      { name: "EROS",               img: `${CDN}/3e02a9f2-e096-472b-85f8-567a453a710c_rw_1200.jpg?h=f89735a910d644f1df0adfec42f3fdfc` },
      { name: "EROS Pool Compliant", img: `${CDN}/b4e3f929-4c8f-433b-a535-3500ca5058a3_rw_1200.jpg?h=1ba18e7cb2c0badabbab5cf1f583ff24`, slides: [`${CDN}/b4e3f929-4c8f-433b-a535-3500ca5058a3_rw_1200.jpg?h=1ba18e7cb2c0badabbab5cf1f583ff24`, `${CDN}/53ed3716-9227-4116-b4b6-be2973bbb29e_rw_1200.jpg?h=8eeb66cbae27101050d4f81d1096aa72`], tags: ["fencing", "gates", "residential"] },
      { name: "EROS",               img: `${CDN}/ee61c9e8-2d02-434f-9751-5b00c0142edd_rw_1200.jpg?h=b70c616d44e9640fdb124317f22211c8` },
      { name: "EROS",               img: "/images/eros/eros-1.jpg", tags: ["fencing", "gates", "residential"] },
      { name: "EROS",               img: "/images/eros/eros-2.jpg", tags: ["fencing", "gates", "residential"] },
      { name: "EROS Canopy / Pergola", img: "/images/eros/eros-3.jpg", tags: ["pergola", "residential"] },
      { name: "EROS Pool Gate",        img: "/images/eros/eros-4.jpg", tags: ["fencing", "gates", "residential"] },
    ],
  },
  {
    name: "EQUISETTI",
    tabs: ["architectural", "light-features"],
    tags: ["light features"],
    items: [
      { name: "EQUISETTI", img: `${CDN}/453b1942-6be0-4365-b111-0affe46a048e_rw_1920.jpg?h=968dc8dad1b2ec3603236a03c95526df` },
      { name: "EQUISETTI", img: "/images/equisetti/equisetti-1.jpg" },
    ],
  },
  {
    name: "GRAIL",
    tags: ["privacy screens", "dividers"],
    items: [
      { name: "GRAIL",                img: `${CDN}/8a9e1d1b-a7b1-4c28-a1c1-d6a4b0dfee8c_rw_1200.jpg?h=5102c2ed1e5e00403afcb7479ac0fa5c` },
      { name: "GRAIL", description: "Grail privacy screen — under-framed divider and tinted perspex", img: `${CDN}/bfb2cefd-e38d-4cbf-86cb-eb955a34f2f9_rw_3840.jpg?h=d8252802c5923b6c85bfbb1d48ffd3f4` },
      { name: "GRAIL Pool Compliant", img: `${CDN}/72b56ce0-8e7a-4269-a157-c96927dd0683_rw_1920.jpg?h=36dff14f3fbbfb62655c885e2c1642d6` },
      { name: "GRAIL — Garage Door",  img: "/images/grail/grail-garage.jpg", description: "GRAIL as inset panels in a timber garage door" },
      { name: "GRAIL — Display",      img: "/images/grail/grail-display.jpg" },
    ],
  },
  {
    name: "HEXO",
    items: [
      { name: "HEXO", img: "/images/hex/lalarook-1.jpg", slides: ["/images/hex/lalarook-1.jpg", "/images/hex/lalarook-2.jpg", "/images/hex/lalarook-copper.jpg"], description: "HEXO — Lalarook Restaurant commercial installation." },
      { name: "HEXO", img: "/images/hex/hex-restaurant.jpg" },
    ],
  },
  {
    name: "ORIEL",
    tags: ["screens", "dividers"],
    items: [
      { name: "ORIEL", img: `${CDN}/314d10c1-5cca-4761-9eb6-7b39034f7a44_rw_1200.jpg?h=3ff521a9e056948f3b1b3199becc57f9`, tags: ["screens", "dividers"] },
      { name: "ORIEL", img: `${CDN}/8e870d8c-8b02-4a6a-82b2-7aed7fc22c83_rw_1920.jpg?h=6b581f0dca9b07bc0e4238973f68d875`, tags: ["fencing", "commercial"] },
    ],
  },
  {
    name: "SABU",
    items: [
      { name: "SABU", img: `${CDN}/42277356-e737-4dca-aae9-3e9121b97db4_rw_1200.jpg?h=c03a465f6daa5e74bbe805dd5ef65af4`, slides: [`${CDN}/42277356-e737-4dca-aae9-3e9121b97db4_rw_1200.jpg?h=c03a465f6daa5e74bbe805dd5ef65af4`, `${CDN}/b46cc1c0-5446-4f3d-83ea-3bd918fdf7eb_rw_1920.jpg?h=0aff88dd1c8854542fe5a4d5c615b79d`] },
    ],
  },
  {
    name: "URO",
    items: [
      { name: "URO", img: `${CDN}/b07ca875-b7c4-4cc6-b61c-91faadf1fa90_rw_1920.jpg?h=6819e6c73e759c2368d4e4ac1309171d`, tags: ["gates", "fencing", "residential"] },
      { name: "URO", img: `${CDN}/99fc46c3-e4c6-4d13-84d5-c0a8b6c33e77_rw_1920.jpg?h=0a73c2c976bd0840b103b37ee073e7b1` },
    ],
  },
  {
    name: "ZARATHSTRA",
    items: [
      { name: "ZARATHSTRA — Helvetica Bar", img: "/images/zarathstra/helvetica-bar.jpg", description: "ZARATHSTRA as a full-height commercial divider at Helvetica Bar — Corten finish.", tags: ["dividers", "commercial"] },
      { name: "ZARATHSTRA",                 img: `${CDN}/4c7e2bda-c2ef-4b97-b455-d2791cc51677_rw_1200.jpg?h=f57d586dcba7ef2f971fa1bb5049b93b`, description: "ZARATHSTRA gate for a residential client in WA south west — Corten powder coat finish.", tags: ["gates", "residential"] },
      { name: "ZARATHSTRA — Kitchen Bench", img: "/images/zarathstra/zarathstra-kitchen-1.jpg", description: "ZARATHSTRA as kitchen bench screen panel — display home", tags: ["screens", "display homes", "residential"] },
    ],
  },

  // ── THE ORGANICS (A–Z) ────────────────────────────────────────────────────
  { name: "BANKSIA", sectionStart: "THE ORGANICS", items: [{ name: "BANKSIA", img: `${CDN}/d9839268-e16d-4adf-8591-580d484748b6_rw_1200.jpg?h=c7ae49cd2077892d124ad81cb5fa040d` }] },
  { name: "BLOOM", items: [
    { name: "BLOOM", img: "/images/bloom/bloom-closeup.jpg", pos: "center top", tags: ["screens", "dividers", "residential"] },
    { name: "BLOOM — Light Feature", img: "/images/bloom/bloom-light-feature.jpg", tags: ["light features", "residential"] },
  ]},
  {
    name: "FERLIE",
    tags: ["gates", "fencing"],
    items: [
      { name: "FERLIE", img: `${CDN}/a8f3ce2e-c51d-47fa-bbee-4563523ef01a_rw_1920.jpg?h=8ed539c980ba51543bf04a555b8b5e93`, slides: [`${CDN}/a8f3ce2e-c51d-47fa-bbee-4563523ef01a_rw_1920.jpg?h=8ed539c980ba51543bf04a555b8b5e93`, `${CDN}/bdb61a14-c6db-4b1d-afdb-2f2a4a4fc5e6_rw_1920.jpg?h=a1f234ab9af18969c5c236e77673295e`], tags: ["divider", "residential", "display homes"] },
      { name: "FERLIE", img: `${CDN}/029eac2b-60ad-4e18-8069-d6fd0461e636_rw_1920.jpg?h=26f831af45d5d849efb3333534c9a0be`, slides: [`${CDN}/029eac2b-60ad-4e18-8069-d6fd0461e636_rw_1920.jpg?h=26f831af45d5d849efb3333534c9a0be`, `${CDN}/ba33fe1d-7307-43fa-9673-44619efde183_rw_1920.jpg?h=9ba8edd0f24ebe7e9890c2442c212807`], tags: ["divider", "residential"] },
      { name: "FERLIE Maek Architects", img: `${CDN}/8e8bddb1-93fa-475c-913b-7dd82eabdef9_rw_1920.jpg?h=f3ecc608389ba0cb478431e9ce3d5ea7`, tags: ["wall decor", "residential"] },
      { name: "FERLIE",                 img: `${CDN}/679d192a-d3c1-4316-aff1-03ac0d9a6326_rw_1200.jpg?h=eb0e96453230f41b4f305b2e7ecc9472`, tags: ["gates", "residential"] },
      { name: "FERLIE",                 img: `${CDN}/87c759cb-528b-4f7e-b17a-6646de8aedca_rw_1200.jpg?h=3a12ba2f33ec5bf9233fd9c5468ef6ec`, tags: ["divider", "residential"] },
    ],
  },
  { name: "PANGEA",  items: [{ name: "PANGEA",  img: `${CDN}/59a1ba1e-dc20-4f20-a4bf-b0a9d7a13a34_rw_1920.jpg?h=0d463c64947758a14bb5e887c6648410`, tags: ["divider", "commercial"] }] },
  {
    name: "VUELTA",
    tabs: ["icons", "organics"],
    items: [
      { name: "VUELTA",              img: `${CDN}/1fcdb08d-cdb7-4792-8883-01100fee426d_rw_1200.jpg?h=9714e17c2c6817b7853e5c5b3572f750` },
      { name: "VUELTA Aquila Homes", img: `${CDN}/df7270df-1c0c-49b2-ae6f-7eeb7545e953_rw_1920.jpg?h=bd2e5ba0c888df850a0ee00976b0af9f`, tags: ["fencing", "residential"] },
      { name: "VUELTA",              img: `${CDN}/c9cc882b-cd1b-4ea9-964a-3b0cddd3cb65_rw_1200.jpg?h=0cd2d30e8b2ee49b21289028072dc6b7`, tags: ["fencing", "residential"] },
      { name: "VUELTA Pergola",      img: "/images/vuelta/vuelta-pergola.jpg", tags: ["pergolas", "awning", "residential"] },
      { name: "VUELTA Balustrade",   img: "/images/vuelta/vuelta-balustrade.jpg", tags: ["balustrade", "residential"] },
    ],
  },
  {
    name: "WATTLE",
    tabs: ["icons", "organics"],
    tags: ["light features", "pergolas"],
    items: [
      { name: "WATTLE", img: `${CDN}/f940abcb-61e1-4097-8525-2be2df42c732_rw_1200.jpg?h=4f68b273d8edc0fa80b00aed05dc067d`, tags: ["wall decor", "residential"] },
      { name: "WATTLE Architectural Screen", img: `${CDN}/4f9d07e7-a1ba-4215-b4ed-86dee879d606_rw_600.jpg?h=98b5087c0cadf4a5f192beb793d55296`, tags: ["wall decor", "residential"] },
      { name: "WATTLE",      img: `${CDN}/ddb014e7-a9d1-43df-8902-f27c1411d25c_rw_1200.jpg?h=143771dc69ff179f56de9f87fb98db73`, tags: ["gates", "residential"] },
      { name: "WATTLE Auto", img: `${CDN}/ab946f3b-cf58-4bd7-b219-c383e827944d_rw_1200.jpg?h=fa6291728d967139e388846cab059343`, tags: ["gates", "residential"] },
      { name: "WATTLE",      img: `${CDN}/dc0ca52a-cee0-491c-9f63-7a83b0ae70fd_rw_1200.jpg?h=6fb11f26e799a0481a4007bae99147d6`, tags: ["gates", "residential"] },
      { name: "WATTLE Light Feature",        img: "/images/wattle/wattle-1.jpg", tags: ["light features", "divider", "commercial"] },
      { name: "WATTLE",                      img: "/images/wattle/wattle-2.jpg", tags: ["light features", "residential"] },
      { name: "WATTLE",                      img: "/images/wattle/wattle-3.jpg", tags: ["fencing", "residential"] },
      { name: "WATTLE",                      img: "/images/wattle/wattle-4.jpg", tags: ["wall decor", "display homes"] },
      { name: "WATTLE Light Feature — Chew Residence", img: "/images/wattle/wattle-5.jpg", tags: ["light features", "residential"] },
      { name: "WATTLE",                      img: "/images/wattle/wattle-6.jpg", tags: ["fencing", "residential"] },
      { name: "WATTLE Architectural Canopy", img: "/images/wattle/wattle-7.jpg", tags: ["awning", "commercial"] },
      { name: "WATTLE Screen",               img: "/images/wattle/wattle-8.jpg", tags: ["fencing", "residential"] },
      { name: "WATTLE Privacy Screen",       img: "/images/wattle/wattle-9.jpg", tags: ["light features", "residential"] },
      { name: "WATTLE Pool Feature",         img: "/images/wattle/wattle-pool-1.jpg", tags: ["light features", "residential"] },
    ],
  },
  { name: "ZED",     items: [{ name: "ZED",     img: `${CDN}/08e92d6e-6d81-4d7b-926f-8ab6ab4c7629_rw_1200.jpg?h=46e452268c10614a138bc250ff0bfd88`, tags: ["wall decor", "residential"] }] },

  // ── THE CLASSICS (A–Z) ────────────────────────────────────────────────────
  {
    name: "DOTTI", sectionStart: "THE CLASSICS",
    items: [
      { name: "DOTTI", img: `${CDN}/5d641ee3-f68a-46f0-836e-a439215cb153_rw_1200.jpg?h=2e876a49c3a095d458f3147933679842`, pos: "right center", tags: ["dividers", "residential", "display homes"] },
      { name: "DOTTI", img: `${CDN}/d0878a20-07d6-43df-84b4-0cfea3ff72b1_rw_1200.jpg?h=ccda4e2650c34c14e495028ecd01d7db`, tags: ["privacy screens", "residential", "display homes"] },
      { name: "DOTTI — Applecross", img: "/images/dotti/dotti-applecross.jpg", tags: ["privacy screens", "residential"] },
      { name: "DOTTI — Platinum", img: "/images/dotti/dotti-platinum.jpg", tags: ["privacy screens", "residential", "display homes"] },
      { name: "DOTTI — Pool", img: "/images/dotti/dotti-pool.jpg", tags: ["privacy screens", "residential"] },
      { name: "DOTTI — Aquilla", img: "/images/dotti/dotti-aquilla.jpg", tags: ["privacy screens", "residential"] },
    ],
  },
  {
    name: "LUMIER",
    items: [
      { name: "LUMIER",                  img: `${CDN}/65df5eb8-8965-49e7-a31c-9fdd5db80da9_rw_1200.jpg?h=8fa0436374c48082a687a93785e8c28e`, tags: ["divider", "residential"] },
      { name: "LUMIER Riverstone Homes", img: `${CDN}/b3bcabc9-b1a6-4362-8c1f-fb0cd111b697_rw_1200.jpg?h=f026699771f0b8e15da0608389ad0a1c`, tags: ["wall decor", "residential", "display homes"] },
      { name: "LUMIER Mirvac Melbourne", img: `${CDN}/0cb8128a-5efd-4474-851e-636aa772a9b4_rw_1920.jpg?h=e0a5bc44e2d0e234a466428e4f5247ff`, pos: "left center", tags: ["divider", "commercial"] },
    ],
  },
  {
    name: "ORIAN",
    items: [
      { name: "ORIAN", img: "/images/screens/orian-wall-decor.jpg", tags: ["wall decor", "residential"] },
      { name: "ORIAN", img: `${CDN}/faa234c5-9ad4-4613-a5fa-7f0d409b38cf_rw_1920.jpg?h=d11c4ec9af7e1952e48ca2f52fa50d11`, tags: ["privacy screens", "residential"] },
      { name: "ORIAN", img: `${CDN}/cf4e542e-07a7-4e7f-9d93-7f022739b389_rw_1920.jpg?h=a7deab93ff4a4ebab0c7e819f7da35fa`, tags: ["divider", "residential"] },
      { name: "ORIAN", img: "/images/orian/orian-1.jpg", tags: ["gates", "residential"] },
    ],
  },
  {
    name: "RISHIKESH",
    items: [
      { name: "RISHIKESH", img: "/images/rishikesh/rishikesh-2.jpg" },
      { name: "RISHIKESH", img: "/images/rishikesh/rishikesh-3.jpg" },
    ],
  },
  {
    name: "VAYA",
    tags: ["dividers"],
    items: [
      { name: "VAYA", img: `${CDN}/62e39404-9a0d-4aaf-b345-7a5c24162ba0_rw_1200.jpg?h=14c88017d7bdff71c4ca032714072664`, tags: ["dividers", "residential"] },
      { name: "VAYA", img: `${CDN}/f158bc26-4f22-47d2-bee1-ba39cc74113e_rw_1200.jpg?h=9b291706b6c76ce980996749ddcac948`, pos: "left center", tags: ["dividers", "residential", "display homes"] },
    ],
  },
  {
    name: "XAVIER",
    items: [
      { name: "XAVIER",                     img: `${CDN}/c811003e-fc79-4bc1-96fc-8c5b5e9019ba_rw_1200.jpg?h=16b45772caf269cb1974676915fdc8a9` },
      { name: "XAVIER Rollingstone Sydney", img: `${CDN}/f3dc2b7b-8496-45da-9ff9-8bc4ba20e8f7_rw_1920.jpg?h=e6346e68c6fdfb984159856228b18dc4`, tags: ["wall decor", "display homes"] },
      { name: "XAVIER Dale Alcock Display", img: `${CDN}/a6956154-7410-44b9-97ce-e5b66efaeb3c_rw_1920.jpg?h=ec561708ca5f83f52a018f5de1016765` },
      { name: "XAVIER",                     img: "/images/xavier/xavier-1.jpg", tags: ["wall decor", "display homes"] },
      { name: "XAVIER",                     img: "/images/xavier/xavier-2.jpg", tags: ["wall decor", "display homes"] },
      { name: "XAVIER",                     img: "/images/xavier/xavier-3.jpg", tags: ["wall decor", "display homes"] },
      { name: "XAVIER",                     img: "/images/xavier/xavier-4.jpg", tags: ["wall decor", "display homes"] },
      { name: "XAVIER — Display Home",      img: "/images/xavier/xavier-display-home.jpg", tags: ["wall decor", "residential", "display homes"] },
      { name: "XAVIER — HIA Show Sydney",    img: "/images/xavier/xavier-hia.jpg", description: "XAVIER — HIA Show Sydney Winning Display" },
    ],
  },
  {
    name: "ZANADA",
    tags: ["gates", "fencing"],
    items: [
      { name: "ZANADA 16mm Aluminium", img: `${CDN}/815b0730-4c38-4163-b3c7-f5c3ac7592ee_rw_1200.jpg?h=e8207472f9d4399d4599b034c0d34e3a`, tags: ["gates", "residential"] },
      { name: "ZANADA Auto",           img: `${CDN}/c9d58bb5-01c5-41be-8bfb-a0f78df67f0c_rw_1200.jpg?h=18839e228aac7b25d1cfa8b109180e92` },
    ],
  },

  // ── THE INDIES (A–Z) ──────────────────────────────────────────────────────
  { name: "AUDA",    sectionStart: "THE INDIES", items: [{ name: "AUDA",    img: `${CDN}/18320e7a-11d9-401e-be88-2882883feca6_rw_1920.jpg?h=4b46a811c317a0c4c6d1371ba030aba1` }] },
  { name: "SPANGLE", items: [{ name: "SPANGLE", img: `${CDN}/59f5ae87-a618-4e13-95ba-fddf818fc3d8_rw_1200.jpg?h=23c4d9db72c9b52a09d6eef29862dd90` }] },

  // ── THE MIRRORS ───────────────────────────────────────────────────────────
  { name: "SABAH", sectionStart: "THE MIRRORS", items: [{ name: "SABAH", img: "/images/mirrors/sabah-1.jpg" }] },
];

const ALL_BESPOKE_SEARCHABLE = (() => {
  const seen = new Set();
  const result = [];
  for (const [tabId, seriesArr] of Object.entries(COMMISSIONS)) {
    const tabLabel = TABS.find(t => t.id === tabId)?.label ?? tabId;
    for (const s of seriesArr) {
      for (const item of s.items) {
        if (!seen.has(item.img)) {
          seen.add(item.img);
          result.push({ ...item, _series: s.label, _tab: tabLabel });
        }
      }
    }
  }
  // Include SCREEN_DESIGNS items so they appear in search
  for (const design of SCREEN_DESIGNS) {
    for (const item of design.items) {
      if (!seen.has(item.img)) {
        seen.add(item.img);
        result.push({ ...item, _series: design.name, _tab: "Screens" });
      }
    }
  }
  return result;
})();

const BESPOKE_SEARCH_ALIASES = {
  // Screen catalogue categories (p.33–37)
  "icons":           ["WATTLE", "FERLIE", "VIASI", "ASLYIAM", "VUELTA", "LUCARIO", "GRAIL", "ROANDER", "ERGO"],
  "architectural":   ["ELLE", "EROS", "ZARATHSTRA", "ORIEL", "SABU", "CHIOLA", "URO", "CUSTOM", "HEXO", "GRAIL"],
  "organics":        ["BANKSIA", "WATTLE", "FERLIE", "VIASI", "PANGEA", "ZED", "VUELTA"],
  "classics":        ["LUMIER", "ORIAN", "DOTTI", "ZANADA", "ROANDER", "XAVIER", "LUCARIO", "VAYA", "RISHIKESH"],
  "indies":          ["AUDA", "SPANGLE"],
  // Residential use types
  "gates":           ["FERLIE", "VIASI", "ZANADA", "EROS", "ZARATHSTRA", "WATTLE", "ERGO", "CHIOLA", "LUCARIO", "ROANDER", "GRAIL", "CUSTOM", "ORIAN", "URO"],
  "fencing":         ["FERLIE", "VIASI", "ZANADA", "EROS", "GRAIL", "URO", "CUSTOM", "ORIEL"],
  "dividers":        ["ASLYIAM", "GRAIL", "WATTLE", "LUMIER", "VUELTA", "XAVIER", "ORIAN", "DOTTI", "VAYA", "ORIEL", "ROANDER", "AUDA"],
  "privacy screens": ["ASLYIAM", "GRAIL", "WATTLE", "LUMIER", "VUELTA", "XAVIER", "ORIAN", "FERLIE", "VIASI"],
  "light features":  ["ERGO"],
  "gates & doors":   ["LUCARIO", "CHIOLA", "EROS", "FERLIE", "VIASI", "ZANADA", "ZARATHSTRA", "WATTLE", "ERGO", "ROANDER", "GRAIL", "CUSTOM"],
  "wall decor":      ["RAVI Inspired", "Homebase Feature", "CREEPING FIG", "VILLA LEAF", "KYRA LEAF", "ROANDER"],
  "entrance":        ["GRAIL", "FERLIE", "LUCARIO", "CHIOLA", "VAYA"],
  "display homes":   ["ASLYIAM", "WATTLE", "LUMIER", "XAVIER", "VIASI", "ORIAN", "DOTTI", "AUDA"],
  "balustrade":      ["EROS", "VUELTA"],
  // Non-screen categories
  "hospitality":     ["HOMEBASE", "LUMIER", "XAVIER", "Divider", "GRAIL", "Cottesloe Patio", "Cottesloe Gate", "Helvetica", "HEXO"],
  "corporate":       ["BENIN Inspired", "RAVI Inspired", "Unity in Diversity", "VUELTA", "ASLYIAM"],
  "outdoor":         ["FERLIE", "DANDELIONS Totems", "ORIAN Totem", "TOTEMS"],
  "memorial":        ["ORIAN Totem", "HUE"],
  "sculptures":      ["DANDELIONS Totems", "TOTEMS", "HUE", "Fiona Stanley", "Centennial Park", "MARAKESH TRIO"],
  "fire pits":       ["HOMEBASE Fire Pit", "REEDS of UNGARO", "YAZAD Fire", "URCHIN", "EQUISETTI"],
  "totems":          ["DANDELIONS Totems", "TOTEMS", "ORIAN Totem"],
};

const PROJECT_CATEGORIES = [
  { id: "homebase",       label: "Homebase WA" },
  { id: "williamstown",   label: "Williamstown Vic" },
  { id: "fiona-stanley",  label: "Fiona Stanley Hospital WA" },
  { id: "centennial",     label: "Centennial Park WA" },
  { id: "cottesloe",      label: "Cottesloe Hotel WA" },
];

const PROJECTS_ROWS = [
  {
    id: "projects-homebase",
    name: "HOMEBASE",
    projectCategory: "homebase",
    location: "Subiaco, Western Australia",
    description: "A landmark mixed-use development in Subiaco, Western Australia. ROGETjames was engaged across the full scope of the project — designing the landscape, creating and fabricating a suite of architectural art features, and project managing the commission from concept through to installation. The works include totems, entrance signage, feature sculptures, fire pit elements and landscape art, each conceived to activate the public spaces of the precinct and work in dialogue with the surrounding architecture.",
    items: [
      { name: "HOMEBASE Entrance",      img: "/images/hero/hero-homebase-entrance.jpg" },
      { name: "HOMEBASE",               img: `${CDN}/cffc33df-3d81-460f-b4aa-9f8adc9d81d8_rw_1200.jpg?h=b0a0ebd2ca83e06d7b56e5fbee049be2` },
      { name: "Homebase Motif",         img: "/images/homebase/homebase-motif-closeup.jpg" },
      { name: "Homebase Feature",       img: "/images/hero/hero-homebase-sculpture.jpg" },
      { name: "Homebase Landscape Design", img: "/images/hero/hero-homebase-dusk.jpg" },
      { name: "HOMEBASE Totems",        img: "/images/hero/hero-homebase-totems.jpg" },
      { name: "HOMEBASE Signage Totems",img: `${CDN}/4605043d-cb34-4ade-9339-8d8bd07645a4_rw_1200.jpg?h=fca4113e721c1c7e73ce20ae5e67de4f` },
      { name: "HOMEBASE Fire Pit",      img: `${CDN}/b4fe3827-e371-4bd2-9bb5-1c0b3def3095_rw_1920.jpg?h=84f3b1d6bc18639679e471b3b23f418d` },
      { name: "EVO Planters",           img: `${CDN}/181378db-3310-4b32-8704-00836f3e0cc8_rw_1200.jpg?h=52a90c81fceb55de4efa45dafc489df8` },
      { name: "EVO Planters",           img: `${CDN}/3826640c-6476-446d-b49c-ba7d1e312544_rw_1200.jpg?h=c0d5d10fff0b19393f91086df8643610` },
    ],
  },
  {
    id: "projects-unity",
    name: "UNITY IN DIVERSITY",
    projectCategory: "centennial",
    location: "Centennial Park, Western Australia",
    description: "A significant public art commission at Centennial Park, Western Australia. The selected design was developed through an extensive concept process, culminating in a site-specific installation that celebrates the identity and spirit of the precinct.",
    items: [
      { name: "UNITY IN DIVERSITY", img: `${CDN}/ce906d3c-248e-42c2-a76c-e7547bae20e7_rw_1200.jpg?h=96bf8823ab48bc3e90055aef0b93ea1f` },
      { name: "Unity in Diversity", img: `${CDN}/6745c491-3d3b-4501-b01c-76a351d2d9d1_rw_1920.jpeg?h=52cf56ba89edab095b94d025686dd55a` },
      { name: "UNITY IN DIVERSITY", img: `${CDN}/b32ea229-d756-4e86-9f8e-ddd64ab25e66_rw_1200.jpg?h=11202a4f895ca6ffb66c1ea982364b6c` },
      { name: "UNITY IN DIVERSITY", img: `${CDN}/5504bc00-e901-49b2-b14b-337476409a29_rw_1200.jpg?h=a80899311d752bd29777628bfaf7ea92` },
      { name: "UNITY IN DIVERSITY", img: `${CDN}/e0829bf1-b7fb-433d-a143-748457e1a18f_rw_1200.jpg?h=035bb64ea46ea3204adb05d29e707054` },
    ],
  },
  {
    id: "projects-cottesloe",
    name: "ERGO — COTTESLOE HOTEL",
    projectCategory: "cottesloe",
    location: "Cottesloe, Western Australia",
    hideBehindTheScenes: true,
    description: "Description to be added.",
    items: [
      { name: "ERGO Cottesloe Hotel", img: `${CDN}/9ea86aef-4d28-4b92-bb98-5293deef8c93_rw_3840.jpg?h=0eaa14f335accdf89ebd50e55234a8fd`, slides: [`${CDN}/9ea86aef-4d28-4b92-bb98-5293deef8c93_rw_3840.jpg?h=0eaa14f335accdf89ebd50e55234a8fd`, `${CDN}/ff393903-5912-40da-9b37-aca22ef599b4_rw_1920.jpg?h=1ef862e9145edcf101d46bcd4a02fb15`] },
      { name: "ERGO Cottesloe Hotel — Gates", img: "/images/hero/hero-cottesloe-gate.jpg" },
    ],
  },
  { id: "projects-fiona-stanley",  name: "FIONA STANLEY HOSPITAL", projectCategory: "fiona-stanley",  location: "Murdoch, Western Australia", description: "Fiona Stanley Hospital sits on land with deep indigenous significance — a place of gathering long before the hospital existed. This commission was an artistic homage to that history. ROGETjames designed and fabricated a series of totem sculptures and installations drawing on indigenous motifs, created with respect for Country and a genuine desire to bring meaning, warmth and identity to the spaces people move through every day.", items: [
    { name: "Fiona Stanley",          img: `${CDN}/13dddf44-cb0a-4ad6-a4ac-3b229792d04d_rw_1920.jpg?h=0542d30e647f6e1d326dee723044be1b` },
    { name: "DANDELIONS Totems",      img: `${CDN}/14c73030-575d-46e2-ae9e-eb407eb06e16_rw_1200.jpg?h=ba62f642a4afa2e84f7480801652c94e` },
    { name: "FIONA STANLEY TOTEMS", img: `${CDN}/0bb31cda-116a-4ec4-8c20-5f25f900287c_rw_1200.jpg?h=bfcf87b6d12a3c5a71b0094e8fba92cd` },
  ] },
  { id: "projects-williamstown",   name: "WILLIAMSTOWN",            projectCategory: "williamstown",    location: "Williamstown, Victoria", hideBehindTheScenes: true, description: "Description to be added.", items: [
    { name: "EROS Canopy",        img: "/images/eros/eros-3.jpg" },
    { name: "EROS Pool Compliant", img: `${CDN}/b4e3f929-4c8f-433b-a535-3500ca5058a3_rw_1200.jpg?h=1ba18e7cb2c0badabbab5cf1f583ff24` },
    { name: "EROS",               img: "/images/eros/eros-2.jpg" },
    { name: "EROS",               img: "/images/eros/eros-1.jpg" },
  ] },
];

const CONCEPTS_ROWS = [
  {
    id: "concepts-percent",
    name: "PERCENT FOR ART",
    items: [
      { name: "Percent for Art", img: `${CDN}/a017e095-21a4-41a4-bdd7-630bb270b4f3_rw_1200.jpg?h=b4276b4f7952052c0cdbc1db1526c232`, slides: [`${CDN}/a017e095-21a4-41a4-bdd7-630bb270b4f3_rw_1200.jpg?h=b4276b4f7952052c0cdbc1db1526c232`, `${CDN}/713bf242-7075-4082-90cd-c885aa129107_rw_1920.jpg?h=a51d01c9d949978e58515742c345cd34`] },
    ],
  },
  {
    id: "concepts-outback",
    name: "OUTBACK INFO BAYS",
    items: [
      { name: "Outback Info Bays", img: `${CDN}/882272cb-30b0-4cef-8f0e-dee3241578e3_rw_1920.jpg?h=accf777e0802c55ffa064f37bb13befe` },
    ],
  },
  {
    id: "concepts-shire",
    name: "SHIRE OF PEEL",
    items: [
      { name: "Shire of Peel", img: `${CDN}/8157a7f2-763b-469d-bca4-dee47707d7da_rw_1920.jpg?h=8c83e1b4dca7446ea02465c6438a82e9`, slides: [`${CDN}/8157a7f2-763b-469d-bca4-dee47707d7da_rw_1920.jpg?h=8c83e1b4dca7446ea02465c6438a82e9`, `${CDN}/39f2b9a7-cf77-4a54-a88e-a92948a82ebe_rw_1920.jpg?h=9e5d420ad71060f91b222a0d11ac0a67`], videoUrl: "/videos/waroona.mp4" },
    ],
  },
  {
    id: "concepts-homebase",
    name: "HOME BASE",
    items: [
      { name: "Home Base",           img: `${CDN}/ba29da64-778e-4e6c-a942-02acff420a19_rw_1200.jpg?h=c81199c62bdc877ac5244d0b3b22f17f` },
      { name: "Home Base Landscape", img: `${CDN}/8aabcc1e-b8c3-45e3-aa3d-c56d5911ea03_rw_1920.jpg?h=142926ed21c731745b66587a99e4c8e0` },
      { name: "Home Base Landscape", img: `${CDN}/4fe97b52-7eca-4995-a9b0-e9caa6d72967_rw_1920.jpg?h=e8870627f871e657b986a401d62100fe` },
      { name: "Home Base Landscape", img: `${CDN}/3ef7ea8e-eec1-4856-b37a-f2d23978aca3_rw_1920.jpg?h=6ec1f7e1ff1f709ad73ac4e78cf30736` },
      { name: "Home Base Landscape", img: `${CDN}/66a80833-aa96-4e7a-a62e-6ce882831573_rw_1200.jpg?h=b3a5cf5b979eb22dc56bd82cc14f5946` },
      { name: "Home Base Landscape", img: `${CDN}/9422ac0b-5ce1-4cca-83fc-660e854c3bb0_rw_1200.jpg?h=3b92abcf4f65601c8e5cd9872c6e3121` },
      { name: "Home Base Landscape", img: `${CDN}/04ac8236-413f-4590-a522-dfca01a94fe8_rw_1200.jpg?h=37ffcbb1ecba586da34b3acca113e525` },
    ],
  },
  {
    id: "concepts-centennial",
    name: "CENTENNIAL PARK",
    items: [
      { name: "Centennial Park (Concepts)", img: `${CDN}/8b43f372-e1ca-4882-b630-bc0d985db4a7_rw_1200.jpg?h=c300bdda09947b73eb5e16f3aa004970` },
    ],
  },
  {
    id: "concepts-cottesloe",
    name: "COTTESLOE RESIDENCE",
    items: [
      { name: "Cottesloe Residence", img: `${CDN}/7c66f9e9-9682-4d93-8bb6-36aa19318e94_rw_1920.jpg?h=610337b8800e7a8f32bcb1e992b7da2e` },
      { name: "Cottesloe Residence", img: `${CDN}/d8d96ede-c60e-4b48-991b-b80f157db3a5_rw_1920.jpg?h=3958d3517925745ac20a9c1ce75ff1c0` },
    ],
  },
];

const BESPOKE_SEARCH_PROMPTS = [
  { label: "Screen Collection", items: ["icons", "architectural", "organics", "classics", "indies"] },
  { label: "By Use",            items: ["gates", "dividers", "privacy screens", "fencing", "balustrade", "light features", "wall decor"] },
  { label: "By Project",        items: ["display homes", "hospitality", "corporate", "entrance"] },
  { label: "By Type",           items: ["sculptures", "fire pits", "totems"] },
];

function CommissionDetail({ item, onClose }) {
  const overlayRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: "power2.out" });
    gsap.fromTo(cardRef.current, { y: 20, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 0.3, ease: "power3.out" });
  }, []);

  const handleClose = useCallback(() => {
    gsap.to(cardRef.current, { y: 14, opacity: 0, scale: 0.95, duration: 0.2, ease: "power2.in" });
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.25, ease: "power2.in", delay: 0.05, onComplete: onClose });
  }, [onClose]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClose]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9995] flex items-center justify-center p-4"
      style={{ background: "rgba(10,10,10,0.82)", backdropFilter: "blur(18px)" }}
      onClick={handleClose}
    >
      <div
        ref={cardRef}
        className="relative w-full max-w-[400px] rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: "rgba(20,20,20,0.97)", border: "1px solid rgba(242,240,233,0.09)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={handleClose} className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center text-cream/50 hover:text-cream hover:bg-black/80 transition-colors">
          <X size={13} />
        </button>
        <div className="aspect-[4/3] overflow-hidden relative bg-charcoal">
          <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
        </div>
        <div className="p-6">
          <p className="font-heading font-semibold text-cream text-base leading-snug">{item.client || item.name}</p>
          {item.description && (
            <p className="text-cream/55 text-sm leading-relaxed mt-3 font-detail">{item.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Lightbox({ items, index, onClose, onPrev, onNext }) {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const lenis = useLenis();

  useEffect(() => {
    lenis?.stop();
    const ctx = gsap.context(() => {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" });
      gsap.fromTo(contentRef.current, { scale: 0.92, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" });
    });
    return () => { ctx.revert(); lenis?.start(); };
  }, [lenis]);

  const prevIdx = useRef(index);
  useEffect(() => {
    if (prevIdx.current !== index && contentRef.current) {
      gsap.fromTo(contentRef.current, { scale: 0.96, opacity: 0.3 }, { scale: 1, opacity: 1, duration: 0.25, ease: "power2.out" });
    }
    prevIdx.current = index;
  }, [index]);

  const handleClose = useCallback(() => {
    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(contentRef.current, { scale: 0.92, opacity: 0, duration: 0.25, ease: "power2.in" });
    tl.to(overlayRef.current, { opacity: 0, duration: 0.25, ease: "power2.in" }, "-=0.1");
  }, [onClose]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleClose, onPrev, onNext]);

  const item = items[index];
  return (
    <div ref={overlayRef} className="fixed inset-0 z-[200] bg-charcoal/95 flex items-center justify-center" onClick={handleClose}>
      <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
        <ChevronLeft size={24} />
      </button>
      <div ref={contentRef} className="flex flex-col items-center gap-4 px-20" onClick={(e) => e.stopPropagation()}>
        <img src={item.img} alt={item.name} className="max-w-[80vw] max-h-[78vh] object-contain rounded-2xl" />
        <div className="flex items-center gap-6">
          <p className="text-cream/80 font-heading font-medium text-sm tracking-wide">{item.name}</p>
          {item.videoUrl && (
            <a href={item.videoUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 text-clay text-sm font-detail font-semibold hover:text-cream transition-colors">
              <span className="w-6 h-6 rounded-full border border-clay flex items-center justify-center" style={{ paddingLeft: "2px" }}>▶</span>
              Watch Reel
            </a>
          )}
        </div>
      </div>
      <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
        <ChevronRight size={24} />
      </button>
      <button onClick={handleClose} className="absolute top-4 md:top-6 right-4 md:right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
        <X size={20} />
      </button>
      <div className="absolute bottom-6 font-detail text-cream/40 text-xs">{index + 1} / {items.length}</div>
    </div>
  );
}

function SlidingThumb({ slides, alt, active, pos }) {
  const [cur, setCur] = useState(0);
  const timerRef = useRef(null);
  useEffect(() => {
    if (slides.length <= 1 || !active) return;
    timerRef.current = setInterval(() => setCur(prev => (prev + 1) % slides.length), 3000);
    return () => { clearInterval(timerRef.current); timerRef.current = null; };
  }, [active, slides.length]);
  return (
    <div className="w-full h-full relative">
      {slides.map((src, i) => (
        <img key={src} src={src} alt={alt}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          style={{ opacity: i === cur ? 1 : 0, transition: 'opacity 0.8s ease', objectPosition: pos || 'center center' }}
        />
      ))}
    </div>
  );
}

function ScreenDesignRow({ design, onOpenLightbox, onDetail, getDebug }) {
  const rowRef = useRef(null);
  const [showRight, setShowRight] = useState(design.items.length > 4);
  const [showLeft, setShowLeft] = useState(false);
  const [rowActive, setRowActive] = useState(false);

  const checkScroll = () => {
    const el = rowRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 8);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };

  const scrollAmount = () => {
    const el = rowRef.current;
    if (!el) return 200;
    const card = el.firstElementChild;
    const cardW = card ? card.offsetWidth + 12 : 220;
    return window.innerWidth < 768 ? cardW : cardW * 2;
  };
  const scrollRight = () => rowRef.current?.scrollBy({ left: scrollAmount(), behavior: "smooth" });
  const scrollLeft  = () => rowRef.current?.scrollBy({ left: -scrollAmount(), behavior: "smooth" });

  const arrowClass = "hidden md:flex absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-charcoal/90 border border-white/15 items-center justify-center text-cream/70 hover:text-cream hover:border-clay hover:bg-charcoal active:bg-charcoal transition-all backdrop-blur-sm z-20";

  return (
    <div onMouseEnter={() => setRowActive(true)} onMouseLeave={() => setRowActive(false)}>
      <div data-series-label className="group/lbl inline-flex mb-2 px-1 cursor-default gap-[0.01em]">
        {design.name.split("").map((char, i) => (
          <span
            key={i}
            className="font-detail text-xs uppercase text-warm-gray group-hover/lbl:text-clay group-hover/lbl:-translate-y-0.5 transition-all"
            style={{ letterSpacing: "0.2em", transitionDuration: "350ms", transitionDelay: `${i * 22}ms`, display: "inline-block", whiteSpace: "pre" }}
          >
            {char}
          </span>
        ))}
      </div>
      <div className="relative">
        <div
          ref={rowRef}
          className="series-scroll flex gap-3 overflow-x-auto pb-1 h-52"
          data-lenis-prevent
          onScroll={checkScroll}
        >
          {design.items.map((item, idx) => {
            const dbg = getDebug ? getDebug(item) : null;
            return (
              <div
                key={idx}
                className="gallery-card group cursor-pointer rounded-2xl overflow-hidden relative flex-none h-full aspect-square"
                onClick={() => onOpenLightbox(design.items, idx)}
              >
                {item.slides
                  ? <SlidingThumb slides={item.slides} alt={item.name} active={rowActive} pos={item.pos} />
                  : <img src={item.img} alt={item.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" style={item.pos ? { objectPosition: item.pos } : undefined} />
                }
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
                  <p className="text-cream font-heading font-semibold text-xs">{item.name}</p>
                </div>
                <button
                  className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 text-cream/80 text-[9px] font-detail tracking-widest uppercase opacity-0 group-hover:opacity-100 hover:bg-clay hover:border-clay hover:text-cream transition-all duration-200 whitespace-nowrap"
                  onClick={(e) => { e.stopPropagation(); onDetail(item); }}
                >
                  details
                </button>
                {dbg && (
                  <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-end p-1">
                    <div className="bg-black/88 backdrop-blur-sm rounded-md px-1.5 py-1.5 space-y-1">
                      <p className="text-cream text-[8px] font-mono font-semibold leading-tight" style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:'100%'}}>{item.name}</p>
                      <p className="text-[7.5px] font-mono leading-tight">
                        <span className="text-yellow-300">{dbg.tabs}</span>
                        {dbg.cats && <span className="text-green-300"> · {dbg.cats}</span>}
                      </p>
                      {dbg.aspects !== undefined && (
                        <div className="border-t border-white/15 pt-0.5">
                          <span className="text-white/40 text-[6.5px] font-mono uppercase tracking-wide">Aspects </span>
                          <span className="text-orange-200 text-[7px] font-mono leading-tight">{dbg.aspects || "—"}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {showLeft && (
          <button onClick={scrollLeft} aria-label="Scroll left" className={`${arrowClass} left-1`}>
            <ChevronLeft size={16} />
          </button>
        )}
        {showRight && (
          <button onClick={scrollRight} aria-label="Scroll right" className={`${arrowClass} right-5`}>
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

function GalleryCard({ item, onClick, onDetail }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="gallery-card group cursor-pointer rounded-2xl overflow-hidden bg-cream-dark relative aspect-square"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {item.slides
        ? <SlidingThumb slides={item.slides} alt={item.name} active={hovered} pos={item.pos} />
        : <img src={item.img} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" style={item.pos ? { objectPosition: item.pos } : undefined} />
      }
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
        <p className="text-cream font-heading font-semibold text-sm">{item.name}</p>
      </div>
      <button
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 text-cream/80 text-[9px] font-detail tracking-widest uppercase opacity-0 group-hover:opacity-100 hover:bg-clay hover:border-clay hover:text-cream transition-all duration-200 whitespace-nowrap"
        onClick={(e) => { e.stopPropagation(); onDetail(); }}
      >
        details
      </button>
    </div>
  );
}

function GalleryModal({ onClose, initialCategory = null }) {
  const [activeTab, setActiveTab] = useState(null);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [sweepingId, setSweepingId] = useState(null);
  const [lightboxItems, setLightboxItems] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [detailItem, setDetailItem] = useState(null);
  const [activeProjectCat, setActiveProjectCat] = useState("homebase");
  const [activeScreenDesign, setActiveScreenDesign] = useState(null);
  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const overlayRef = useRef(null);
  const panelRef = useRef(null);
  const bodyRef = useRef(null);
  const gridRef = useRef(null);
  const searchRef = useRef(null);
  const searchRowRef = useRef(null);
  const isAnimating = useRef(false);
  const lenis = useLenis();

  useEffect(() => {
    lenis?.stop();
    gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" });
    gsap.fromTo(panelRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" });
    window.__galleryModalBody = bodyRef;
    return () => { lenis?.start(); window.__galleryModalBody = null; };
  }, [lenis]);

  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll(".gallery-card");
    if (!cards.length) return;
    gsap.fromTo(cards, { y: 30, opacity: 0, scale: 0.97 }, {
      y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.05, ease: "power3.out",
    });
  }, [activeTab, activeCategory]);

  // Screen design label flip-in (same pattern as wall art series labels)
  useEffect(() => {
    if (activeCategory !== "screens") return;
    const labels = bodyRef.current?.querySelectorAll("[data-series-label]");
    if (!labels?.length) return;
    const observers = [];
    labels.forEach((label) => {
      const spans = label.querySelectorAll("span");
      gsap.set(spans, { rotationY: 90, transformPerspective: 400, transformOrigin: "center center", opacity: 0 });
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          gsap.to(spans, {
            rotationY: 0, opacity: 1, color: "#C45018",
            duration: 0.5, stagger: 0.04, ease: "back.out(1.4)",
            onComplete: () => gsap.set(spans, { clearProps: "rotationY,transformPerspective,transformOrigin" }),
          });
        } else {
          gsap.killTweensOf(spans);
          gsap.set(spans, { rotationY: 90, transformPerspective: 400, transformOrigin: "center center", opacity: 0 });
        }
      }, { threshold: 0.3, root: bodyRef.current });
      observer.observe(label);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [activeCategory]);

  const handleClose = useCallback(() => {
    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(panelRef.current, { y: 30, opacity: 0, duration: 0.3, ease: "power2.in" });
    tl.to(overlayRef.current, { opacity: 0, duration: 0.25, ease: "power2.in" }, "-=0.15");
  }, [onClose]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape" && !lightboxItems && !detailItem) {
        if (query) setQuery("");
        else handleClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleClose, lightboxItems, detailItem, query]);

  const searchResults = query.trim().length > 0
    ? (() => {
        const q = query.trim().toLowerCase();
        const aliasNames = Object.entries(BESPOKE_SEARCH_ALIASES)
          .filter(([key]) => key.includes(q) || q.includes(key))
          .flatMap(([, names]) => names.map(n => n.toLowerCase()));
        return ALL_BESPOKE_SEARCHABLE.filter(item =>
          item.name.toLowerCase().includes(q) ||
          item._series.toLowerCase().includes(q) ||
          item._tab.toLowerCase().includes(q) ||
          item.client?.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          aliasNames.includes(item.name.toLowerCase())
        );
      })()
    : null;

  useEffect(() => {
    const row = searchRowRef.current;
    if (!row) return;
    let targetSpeed = 0, scrollSpeed = 0, rafId = null;
    const tick = () => { scrollSpeed += (targetSpeed - scrollSpeed) * 0.1; if (Math.abs(scrollSpeed) > 0.05) row.scrollLeft += scrollSpeed; rafId = requestAnimationFrame(tick); };
    const onMouseMove = (e) => { const rect = row.getBoundingClientRect(); const x = e.clientX - rect.left; const w = rect.width; const zone = w * 0.22; if (x > w - zone) targetSpeed = ((x - (w - zone)) / zone) * 14; else if (x < zone) targetSpeed = -((zone - x) / zone) * 14; else targetSpeed = 0; };
    const onEnter = () => { rafId = requestAnimationFrame(tick); };
    const onLeave = () => { targetSpeed = 0; if (rafId) { cancelAnimationFrame(rafId); rafId = null; scrollSpeed = 0; } };
    row.addEventListener("mouseenter", onEnter);
    row.addEventListener("mouseleave", onLeave);
    row.addEventListener("mousemove", onMouseMove);
    return () => { row.removeEventListener("mouseenter", onEnter); row.removeEventListener("mouseleave", onLeave); row.removeEventListener("mousemove", onMouseMove); if (rafId) cancelAnimationFrame(rafId); };
  }, [searchResults]);

  const animateOut = useCallback((onComplete) => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    const cards = gridRef.current?.querySelectorAll(".gallery-card");
    if (!cards?.length) { onComplete(); isAnimating.current = false; return; }
    gsap.to(cards, {
      opacity: 0, scale: 0.95, y: -15, duration: 0.2, stagger: 0.02, ease: "power2.in",
      onComplete: () => { onComplete(); isAnimating.current = false; },
    });
  }, []);

  const clearFilters = useCallback(() => {
    animateOut(() => { setActiveTab(null); setActiveCategory(null); setActiveScreenDesign(null); });
  }, [animateOut]);

  const switchTab = useCallback((id) => {
    animateOut(() => { setActiveTab(t => t === id ? null : id); setActiveScreenDesign(null); });
  }, [animateOut]);

  const switchCategory = useCallback((id) => {
    animateOut(() => { setActiveCategory(c => c === id ? null : id); setActiveScreenDesign(null); });
  }, [animateOut]);

  const dedup = (items) => {
    const seen = new Set();
    return items.filter(item => { if (seen.has(item.img)) return false; seen.add(item.img); return true; });
  };

  const activeCatDef = CATEGORY_FILTERS.find(c => c.id === activeCategory);
  const catItems = activeCatDef ? getBySeriesIds(activeCatDef.seriesIds) : null;

  // Projects and Concepts are standalone row-based galleries — not combinable with tabs
  const isStandaloneGallery = activeCategory === "projects" || activeCategory === "concepts";

  // null → use organised series view (tab only); array → flat grid
  const flatItems = (() => {
    // Default: both null → show all images
    if (!activeTab && !activeCategory) return dedup(ALL_SERIES.flatMap(s => s.items));
    // Standalone galleries (Projects, Concepts) render as rows — bypass flat grid
    if (isStandaloneGallery) return null;
    // Tab only → series view
    if (activeTab && !activeCategory) return null;
    // Concepts (allTabs:true) or category only → full category regardless of tab
    if (activeCatDef?.allTabs || !activeTab) return dedup(catItems);
    // Tab + category → intersection via series IDs (prevents cross-tab bleed)
    const tabSeriesIds = new Set(COMMISSIONS[activeTab].map(s => s.id));
    const intersectIds = activeCatDef.seriesIds.filter(id => tabSeriesIds.has(id));
    return dedup(getBySeriesIds(intersectIds));
  })();

  const activeSeries = flatItems === null ? COMMISSIONS[activeTab] : null;
  const hasFilters = activeTab !== null || activeCategory !== null;

  // Scope the lightbox to just the series that owns the clicked image, then loop within it.
  const openLightbox = (items, idx) => { setLightboxItems(items); setLightboxIndex(idx); };
  const openLightboxScoped = useCallback((item) => {
    const owner = ALL_SERIES.find(s => s.items.some(si => si.img === item.img));
    const pool  = owner ? owner.items : [item];
    const i     = pool.findIndex(si => si.img === item.img);
    setLightboxItems(pool);
    setLightboxIndex(i >= 0 ? i : 0);
  }, []);
  const openDetailOrLightbox = useCallback((item) => {
    if (item.videoUrl) { openLightboxScoped(item); } else { setDetailItem(item); }
  }, [openLightboxScoped]);
  const closeLightbox = useCallback(() => { setLightboxItems(null); setLightboxIndex(null); }, []);
  const prevLightbox = useCallback(() => setLightboxIndex((i) => (i > 0 ? i - 1 : lightboxItems.length - 1)), [lightboxItems]);
  const nextLightbox = useCallback(() => setLightboxIndex((i) => (i < lightboxItems.length - 1 ? i + 1 : 0)), [lightboxItems]);

  return (
    <>
      <div ref={overlayRef} className="fixed inset-0 z-[100] bg-charcoal/80 backdrop-blur-sm" onClick={handleClose} />
      <div ref={panelRef} className="fixed inset-0 md:inset-6 z-[110] bg-charcoal md:rounded-3xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex flex-wrap items-center gap-3 px-5 md:px-8 py-4 md:py-5 border-b border-white/10 flex-none">
          <div className="flex-none">
            <span className="font-detail text-xs text-warm-gray uppercase tracking-[0.2em]">Commissions</span>
            <h2 className="font-heading font-bold text-xl md:text-2xl text-cream mt-1">
              Bespoke <span className="text-cream/60">Gallery</span>
            </h2>
          </div>
          {/* Search bar */}
          <div className="relative flex-1 min-w-[140px] max-w-sm ml-auto">
            <div className={`flex items-center gap-2 bg-white/5 border rounded-full px-4 py-2 transition-colors ${searchFocused ? "border-clay/50" : "border-white/10"}`}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-warm-gray flex-none">
                <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M10 10L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 180)}
                placeholder="Search"
                className="flex-1 bg-transparent text-cream text-base font-detail font-medium outline-none placeholder:text-cream/60 min-w-0"
              />
              {query && (
                <button onClick={() => { setQuery(""); searchRef.current?.focus(); }} className="text-warm-gray hover:text-cream transition-colors flex-none">
                  <X size={13} />
                </button>
              )}
            </div>
            {/* Suggestions dropdown */}
            {searchFocused && !query && (
              <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#1a1a1a] border border-white/10 rounded-2xl p-4 shadow-2xl">
                <p className="font-detail text-[9px] text-warm-gray/40 uppercase tracking-[0.2em] mb-3">Try searching for…</p>
                {BESPOKE_SEARCH_PROMPTS.map(group => (
                  <div key={group.label} className="mb-3 last:mb-0">
                    <p className="font-detail text-[9px] text-warm-gray/60 uppercase tracking-[0.2em] mb-2">{group.label}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {group.items.map(term => (
                        <button
                          key={term}
                          onMouseDown={e => e.preventDefault()}
                          onClick={() => { setQuery(term); searchRef.current?.focus(); }}
                          className="px-3 py-1 rounded-full text-xs font-detail bg-white/5 border border-white/10 text-cream/60 hover:border-clay/60 hover:text-cream hover:bg-white/8 transition-all duration-200 capitalize"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button onClick={handleClose} className="flex-none p-2.5 rounded-full bg-white/10 text-cream hover:bg-white/20 transition-colors" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Scrollable body */}
        <div ref={bodyRef} className="flex-1 overflow-y-auto" data-lenis-prevent>
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">

            {/* Search results */}
            {searchResults !== null && (
              <div className="mb-8 space-y-4">
                <p className="font-detail text-xs text-warm-gray uppercase tracking-[0.2em]">
                  {searchResults.length === 0 ? "No results found" : `${searchResults.length} result${searchResults.length !== 1 ? "s" : ""}`}
                </p>
                {searchResults.length > 0 && (
                  <div ref={searchRowRef} className="search-scroll flex gap-3 overflow-x-auto pb-2" data-lenis-prevent>
                    {searchResults.map((item, idx) => (
                      <div
                        key={idx}
                        className="gallery-card group cursor-pointer rounded-2xl overflow-hidden bg-cream-dark relative aspect-square flex-none"
                        style={{ width: "calc(20% - 9.6px)", minWidth: "160px" }}
                        onClick={() => openLightboxScoped(item)}
                      >
                        <img src={item.img} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
                          <p className="text-cream font-heading font-semibold text-xs">{item.name}</p>
                          <p className="text-cream/50 font-detail text-[9px] uppercase tracking-wider mt-0.5">{item._series}</p>
                        </div>
                        <button
                          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 text-cream/80 text-[9px] font-detail tracking-widest uppercase opacity-0 group-hover:opacity-100 hover:bg-clay hover:border-clay hover:text-cream transition-all duration-200 whitespace-nowrap"
                          onClick={(e) => { e.stopPropagation(); setDetailItem(item); }}
                        >
                          details
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Filter pills — hidden while searching */}
            {searchResults === null && <div className="flex flex-col gap-3 mb-10">
              <div className="flex flex-wrap items-center gap-2 pb-1">

                {/* All pill — active when no filters are set */}
                <button
                  onClick={clearFilters}
                  className="filter-btn px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap"
                  style={{
                    backgroundColor: !hasFilters ? "#C45018" : "#1A1A1A",
                    color: "#F2F0E9",
                    border: !hasFilters ? "none" : "1px solid rgba(242,240,233,0.15)",
                    transition: "background-color 0.3s ease",
                  }}
                >
                  All
                </button>

                <span className="w-2.5 h-2.5 rounded-full border border-clay/60 flex-none mx-1" />

                {/* Tab pills */}
                {TABS.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        if (sweepingId) return;
                        setSweepingId(tab.id);
                        setTimeout(() => { setSweepingId(null); switchTab(tab.id); }, 700);
                      }}
                      className={`filter-btn px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                        sweepingId === tab.id ? "filter-btn-sweeping" :
                        isActive ? "filter-btn-active" : "filter-btn-inactive"
                      }`}
                      style={{
                        backgroundColor: isActive ? "#C45018" : "#1A1A1A",
                        color: "#F2F0E9",
                        border: isActive ? "none" : "1px solid rgba(242,240,233,0.15)",
                        transition: "background-color 0.6s ease 0.7s, opacity 0.3s ease",
                        position: "relative",
                        opacity: isStandaloneGallery ? 0.3 : 1,
                        pointerEvents: isStandaloneGallery ? "none" : "auto",
                      }}
                    >
                      <span>{tab.label}</span>
                    </button>
                  );
                })}

                <span className="w-2.5 h-2.5 rounded-full border border-clay/60 flex-none mx-1" />

                {/* Category pills */}
                {CATEGORY_FILTERS.map((cat, idx) => {
                  const isActive = activeCategory === cat.id;
                  const isStandalone = cat.id === "projects" || cat.id === "concepts";
                  // Non-standalone pills dim when a standalone gallery is active
                  const dimmed = isStandaloneGallery && !isStandalone;
                  return (
                    <span key={cat.id} className="flex items-center gap-2">
                      {idx === 4 && <span className="w-2.5 h-2.5 rounded-full border border-clay/60 flex-none" />}
                      <button
                        onClick={() => switchCategory(cat.id)}
                        className="filter-btn px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap"
                        style={{
                          backgroundColor: isActive ? "#C45018" : "#1A1A1A",
                          color: "#F2F0E9",
                          border: isActive ? "none" : "1px solid rgba(242,240,233,0.15)",
                          transition: "background-color 0.3s ease, opacity 0.3s ease",
                          opacity: dimmed ? 0.3 : 1,
                          pointerEvents: dimmed ? "none" : "auto",
                        }}
                      >
                        {cat.label}
                      </button>
                    </span>
                  );
                })}
              </div>

              {/* Clear button — only visible when a filter is active */}
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-detail text-cream/40 hover:text-cream/70 border border-white/10 hover:border-white/25 transition-all duration-200"
                >
                  <X size={10} />
                  <span className="uppercase tracking-wider">Clear filters</span>
                </button>
              )}
            </div>}

            {/* Grid — hidden while searching */}
            {searchResults === null && <div ref={gridRef}>
              {activeCategory === "projects" ? (
                <div className="flex flex-col gap-6">
                  {/* Category pills */}
                  <div className="flex flex-wrap gap-2 pb-2 border-b border-white/8">
                    {PROJECT_CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setActiveProjectCat(cat.id)}
                        className={`px-4 py-1.5 rounded-full font-detail text-[11px] uppercase tracking-[0.15em] transition-all duration-200 ${
                          activeProjectCat === cat.id
                            ? "bg-clay text-jet font-semibold"
                            : "bg-white/8 text-cream/60 hover:bg-white/15 hover:text-cream"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                  {/* Filtered rows */}
                  {PROJECTS_ROWS.filter(r => r.projectCategory === activeProjectCat && r.items.length > 0).length === 0 ? (
                    <p className="font-detail text-cream/30 text-sm text-center py-16 tracking-wider uppercase">Images coming soon</p>
                  ) : (
                    PROJECTS_ROWS.filter(r => r.projectCategory === activeProjectCat).map(row => (
                      <ScreenDesignRow key={row.id} design={row} onOpenLightbox={openLightbox} onDetail={openDetailOrLightbox}
                        getDebug={DEBUG_LABELS ? (item) => _manualCodes[item.img] || _debugMap.get(item.img) : null} />
                    ))
                  )}
                </div>
              ) : activeCategory === "concepts" ? (
                <div className="flex flex-col gap-8">
                  {CONCEPTS_ROWS.map(row => (
                    <ScreenDesignRow key={row.id} design={row} onOpenLightbox={openLightbox} onDetail={openDetailOrLightbox}
                      getDebug={DEBUG_LABELS ? (item) => _manualCodes[item.img] || _debugMap.get(item.img) : null} />
                  ))}
                </div>
              ) : activeCategory === "screens" && !activeTab ? (
                <div className="flex flex-col gap-4">
                  {/* Design pills — shown always; "All designs" resets selection */}
                  <div className="flex flex-wrap gap-2 pb-3 border-b border-white/8">
                    <button
                      onClick={() => setActiveScreenDesign(null)}
                      className="filter-btn px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap"
                      style={{ backgroundColor: !activeScreenDesign ? "#C45018" : "#1A1A1A", color: "#F2F0E9", border: !activeScreenDesign ? "none" : "1px solid rgba(242,240,233,0.15)", transition: "background-color 0.3s ease" }}
                    >All designs</button>
                    {SCREEN_DESIGNS.filter(d => d.items.length > 0).map(design => (
                      <button
                        key={design.name}
                        onClick={() => setActiveScreenDesign(design.name)}
                        className="filter-btn px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap"
                        style={{ backgroundColor: activeScreenDesign === design.name ? "#C45018" : "#1A1A1A", color: "#F2F0E9", border: activeScreenDesign === design.name ? "none" : "1px solid rgba(242,240,233,0.15)", transition: "background-color 0.3s ease" }}
                      >{design.name}</button>
                    ))}
                  </div>

                  {/* No design selected: overview rows — clicking thumb selects that design */}
                  {!activeScreenDesign && (() => {
                    let visibleRowIdx = 0;
                    return SCREEN_DESIGNS.map(design => {
                      if (!design.items.length) return null;
                      const rowIdx = visibleRowIdx++;
                      return (
                        <React.Fragment key={design.name}>
                          {design.sectionStart && (
                            <p className="font-detail text-[10px] text-warm-gray/50 uppercase tracking-[0.22em] pt-6 pb-3 mt-2">
                              {design.sectionStart}
                            </p>
                          )}
                          <ScreenDesignRow
                            design={design}
                            onOpenLightbox={() => setActiveScreenDesign(design.name)}
                            onDetail={() => setActiveScreenDesign(design.name)}
                          />
                          {(rowIdx === 2 || rowIdx === 3 || rowIdx === 4) && (
                            <div className="w-full overflow-hidden my-2" style={{ height: "110px" }}>
                              <div className="flex gap-2 h-full" style={{ width: "max-content", animation: "marquee-scroll 40s linear infinite", willChange: "transform" }}>
                                {[...SCREENS_MARQUEE_IMGS, ...SCREENS_MARQUEE_IMGS].map((src, i) => (
                                  <img key={i} src={src} alt="" className="h-full w-auto object-cover rounded" style={{ aspectRatio: "4/3", flexShrink: 0 }} />
                                ))}
                              </div>
                            </div>
                          )}
                        </React.Fragment>
                      );
                    });
                  })()}

                  {/* Design selected: all its images as a grid — clicking opens lightbox */}
                  {activeScreenDesign && (() => {
                    const d = SCREEN_DESIGNS.find(d => d.name === activeScreenDesign);
                    if (!d) return null;
                    return (
                      <div className="flex flex-wrap justify-center gap-2">
                        {d.items.map((item, idx) => (
                          <div key={idx}
                            onClick={() => openLightbox(d.items, idx)}
                            className="group cursor-pointer relative aspect-square rounded-lg overflow-hidden border border-white/8 hover:border-clay/50 transition-all duration-200"
                            style={{ width: "calc(10% - 8px)", minWidth: 80, opacity: 0, animation: "fadeIn 0.6s ease forwards", animationDelay: `${(((idx * 0.618) % 1) * 1.5).toFixed(2)}s` }}>
                            {item.slides
                              ? <img src={item.slides[0]} alt={item.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" style={item.pos ? { objectPosition: item.pos } : undefined} />
                              : <img src={item.img} alt={item.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" style={item.pos ? { objectPosition: item.pos } : undefined} />
                            }
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-1.5">
                              <p className="font-detail text-[9px] font-semibold uppercase tracking-wide text-cream leading-tight">{item.name}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              ) : flatItems ? (
                flatItems.length === 0 ? (
                  <p className="font-detail text-cream/30 text-sm text-center py-16 tracking-wider uppercase">No matching works in this combination</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {flatItems.map((item, idx) => {
                      const r = Math.floor(idx / 5) + 1;
                      const c = (idx % 5) + 1;
                      const isAllView = !activeTab && !activeCategory;
                      const dbg = DEBUG_LABELS ? (_manualCodes[item.img] || _debugMap.get(item.img)) : null;
                      return (
                        <div key={idx} className="relative">
                          <GalleryCard item={item} onClick={() => openLightboxScoped(item)} onDetail={() => openDetailOrLightbox(item)} />
                          {dbg && (
                            <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between p-1">
                              <div className="self-start">
                                {isAllView && (
                                  <div className="bg-clay text-[#111] text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md leading-tight">
                                    R{r}·I{c}
                                  </div>
                                )}
                              </div>
                              <div className="bg-black/88 backdrop-blur-sm rounded-md px-1.5 py-1.5 space-y-1">
                                <p className="text-cream text-[8px] font-mono font-semibold leading-tight" style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:'100%'}}>{item.name}</p>
                                <p className="text-[7.5px] font-mono leading-tight">
                                  <span className="text-yellow-300">{dbg.tabs}</span>
                                  {dbg.cats && <span className="text-green-300"> · {dbg.cats}</span>}
                                </p>
                                {dbg.aspects !== undefined && (
                                  <div className="border-t border-white/15 pt-0.5">
                                    <span className="text-white/40 text-[6.5px] font-mono uppercase tracking-wide">Aspects </span>
                                    <span className="text-orange-200 text-[7px] font-mono leading-tight">{dbg.aspects || "—"}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )
              ) : activeSeries ? (
                activeSeries.map((series) => (
                  series.items.length > 0 && (
                    <div key={series.id} className="mb-10">
                      <p className="font-detail text-[10px] text-warm-gray uppercase tracking-[0.2em] mb-4">{series.label}</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {series.items.map((item, idx) => {
                          const dbg = DEBUG_LABELS ? (_manualCodes[item.img] || _debugMap.get(item.img)) : null;
                          return (
                            <div key={idx} className="relative">
                              <GalleryCard item={item} onClick={() => openLightbox(series.items, idx)} onDetail={() => openDetailOrLightbox(item)} />
                              {dbg && (
                                <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-end p-1">
                                  <div className="bg-black/88 backdrop-blur-sm rounded-md px-1.5 py-1.5 space-y-1">
                                    <p className="text-cream text-[8px] font-mono font-semibold leading-tight" style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:'100%'}}>{item.name}</p>
                                    <p className="text-[7.5px] font-mono leading-tight">
                                      <span className="text-yellow-300">{dbg.tabs}</span>
                                      {dbg.cats && <span className="text-green-300"> · {dbg.cats}</span>}
                                    </p>
                                    {dbg.aspects !== undefined && (
                                      <div className="border-t border-white/15 pt-0.5">
                                        <span className="text-white/40 text-[6.5px] font-mono uppercase tracking-wide">Aspects </span>
                                        <span className="text-orange-200 text-[7px] font-mono leading-tight">{dbg.aspects || "—"}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )
                ))
              ) : null}
            </div>}

          </div>
        </div>
      </div>

      {lightboxItems !== null && lightboxIndex !== null && (
        <Lightbox items={lightboxItems} index={lightboxIndex} onClose={closeLightbox} onPrev={prevLightbox} onNext={nextLightbox} />
      )}

      {detailItem && (
        <CommissionDetail item={detailItem} onClose={() => setDetailItem(null)} />
      )}
    </>
  );
}


// ── Screens Portal ──────────────────────────────────────────────────────────

const SCREENS_PORTAL_IMGS = [
  `/images/screens/strip/viasi.jpg`,
  `/images/screens/strip/marakesh-fdl.jpg`,
  `/images/screens/strip/wattle.jpg`,
  `/images/screens/strip/aslyiam.jpg`,
  `/images/screens/strip/orian.jpg`,
  `/images/screens/strip/wattle-urn.jpg`,
  `/images/bloom/bloom-closeup.jpg`,
];

const SCREENS_CAT_PAGES = [
  ...[31, 32, 33, 34, 35, 36, 37].map(n =>
    `/images/catalogues/cat1/page-${String(n).padStart(2, "0")}.jpg`
  ),
  `/images/catalogues/cat2/page-10.jpg`,
];

const SCREEN_DESIGNS_SECTIONED = (() => {
  const sectionMap = {
    "THE ICONS":         "icons",
    "THE ARCHITECTURAL": "architectural",
    "THE ORGANICS":      "organics",
    "THE CLASSICS":      "classics",
    "THE INDIES":        "indies",
    "THE MIRRORS":       "mirrors",
  };
  let section = "icons";
  return SCREEN_DESIGNS.map(d => {
    if (d.sectionStart) section = sectionMap[d.sectionStart] ?? section;
    return { ...d, _section: section, _sections: d.tabs ?? [section] };
  });
})();

const SCREEN_TABS = [
  { id: "all",           label: "ALL" },
  { id: "icons",         label: "ICONS" },
  { id: "architectural", label: "ARCHITECTURAL" },
  { id: "organics",      label: "ORGANICS" },
  { id: "classics",      label: "CLASSICS" },
  { id: "indies",        label: "INDIES" },
  { id: "light-features", label: "LIGHT FEATURES" },
  { id: "mirrors",        label: "MIRRORS" },
];

function ScreensCatalogueModal({ onClose }) {
  return <CatPageViewer pages={SCREENS_CAT_PAGES} label="Screens Catalogue" onClose={onClose} />;
}

function PortalLightbox({ items, index, onClose, onPrev, onNext }) {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const imgRef = useRef(null);
  const lenis = useLenis();
  const [slideIdx, setSlideIdx] = useState(0);

  const item = items[index];
  const slides = item.slides || [item.img];

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setSlideIdx(0); }, [index]);

  useEffect(() => {
    lenis?.stop();
    const ctx = gsap.context(() => {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" });
      gsap.fromTo(contentRef.current, { scale: 0.92, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "power2.out" });
    });
    return () => { ctx.revert(); lenis?.start(); };
  }, [lenis]);

  const handleClose = useCallback(() => {
    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(contentRef.current, { scale: 0.92, opacity: 0, duration: 0.3, ease: "power2.in" });
    tl.to(overlayRef.current, { opacity: 0, duration: 0.3, ease: "power2.in" }, "-=0.15");
  }, [onClose]);

  const crossfadeTo = useCallback((fn) => {
    if (!imgRef.current) { fn(); return; }
    gsap.to(imgRef.current, {
      opacity: 0, duration: 0.25, ease: "power2.inOut",
      onComplete: () => { fn(); gsap.to(imgRef.current, { opacity: 1, duration: 0.25, ease: "power2.inOut" }); },
    });
  }, []);

  const handleLeft = useCallback(() => {
    if (slideIdx > 0) crossfadeTo(() => setSlideIdx(i => i - 1));
    else crossfadeTo(() => { setSlideIdx(0); onPrev(); });
  }, [slideIdx, crossfadeTo, onPrev]);

  const handleRight = useCallback(() => {
    if (slideIdx < slides.length - 1) crossfadeTo(() => setSlideIdx(i => i + 1));
    else crossfadeTo(() => { setSlideIdx(0); onNext(); });
  }, [slideIdx, slides.length, crossfadeTo, onNext]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft") handleLeft();
      if (e.key === "ArrowRight") handleRight();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClose, handleLeft, handleRight]);

  return (
    <div ref={overlayRef} className="lightbox-overlay" onClick={handleClose}>
      <button onClick={(e) => { e.stopPropagation(); handleLeft(); }}
        className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 active:bg-white/30 transition-colors z-20"
        aria-label="Previous">
        <ChevronLeft size={24} />
      </button>
      <div ref={contentRef} className="flex flex-col items-center justify-center px-14 md:px-20 w-full max-w-5xl gap-3"
        style={{ height: "calc(100vh - 96px)", marginTop: "72px" }}
        onClick={(e) => e.stopPropagation()}>
        <div className="w-full flex items-center justify-center relative flex-none">
          <img ref={imgRef} src={slides[slideIdx]} alt={item.name}
            className="max-w-full object-contain rounded-2xl" style={{ maxHeight: "68vh" }} />
        </div>
        <div className="flex-shrink-0 flex flex-col items-center gap-1 pt-0 pb-4 w-full max-w-lg">
          <p className="text-cream font-heading font-semibold text-base tracking-wide">{item.name}</p>
          {slides.length > 1 && (
            <div className="flex gap-2 mt-0.5">
              {slides.map((_, i) => (
                <button key={i} onClick={() => crossfadeTo(() => setSlideIdx(i))}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${i === slideIdx ? "bg-cream" : "bg-cream/40"}`} />
              ))}
            </div>
          )}
        </div>
      </div>
      <button onClick={(e) => { e.stopPropagation(); handleRight(); }}
        className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 active:bg-white/30 transition-colors z-20"
        aria-label="Next">
        <ChevronRight size={24} />
      </button>
      <div className="absolute top-4 md:top-6 left-4 right-4 flex items-center justify-between z-20"
        onClick={(e) => e.stopPropagation()}>
        <div className="font-detail text-cream/40 text-xs tracking-wider">{index + 1} / {items.length}</div>
        <button onClick={handleClose}
          className="p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 active:bg-white/30 transition-colors"
          aria-label="Close">
          <X size={20} />
        </button>
      </div>
    </div>
  );
}

const SCREEN_SEARCH_SUGGESTIONS = [
  { label: "By Category", items: ["icons", "architectural", "organics", "classics", "indies"] },
  { label: "By Use",      items: ["gates", "fencing", "balustrade", "privacy screens", "dividers", "wall decor", "light features", "pergolas", "awning", "commercial", "residential", "display homes"] },
  { label: "By Design",  items: SCREEN_DESIGNS.map(d => d.name.toLowerCase()) },
];

export function ScreensGalleryModal({ onClose }) {
  const [tab, setTab] = useState("all");
  const [activeDesign, setActiveDesign] = useState(null); // null = show all, string = filtered to one design
  const [designPillsOpen, setDesignPillsOpen] = useState(false);
  const [flatIdx, setFlatIdx] = useState(null); // null = grid view, integer = expanded slideshow
  const [slideIdx, setSlideIdx] = useState(0);
  const [animDir, setAnimDir] = useState(null);
  const [jumpByDesign, setJumpByDesign] = useState(true); // true = arrows hop design-to-design; false = image-by-image
  const [showCat, setShowCat] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchInputRef = useRef(null);
  const thumbStripRef = useRef(null);
  const activeThumbRef = useRef(null);
  const touchStartX = useRef(0);
  const pillStripRef = useRef(null);
  const [_pillAtEnd, setPillAtEnd] = useState(false);

  // Callback ref: fires when element mounts — guarantees non-passive wheel listener attaches
  const pillStripCallbackRef = useCallback((el) => {
    if (pillStripRef.current) {
      pillStripRef.current._wheelHandler && pillStripRef.current.removeEventListener("wheel", pillStripRef.current._wheelHandler);
    }
    pillStripRef.current = el;
    if (!el) return;
    const handler = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    el._wheelHandler = handler;
    el.addEventListener("wheel", handler, { passive: false });
    el.addEventListener("scroll", () => {
      setPillAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
    }, { passive: true });
  }, []);

  const tabDesigns = tab === "all"
    ? SCREEN_DESIGNS_SECTIONED
    : SCREEN_DESIGNS_SECTIONED.filter(d => d._sections.includes(tab));
  const visibleDesigns = activeDesign
    ? tabDesigns.filter(d => d.name === activeDesign)
    : tabDesigns;
  const activeDrillDesign = activeDesign ? tabDesigns.find(d => d.name === activeDesign) : null;

  // One entry per image across all visible designs
  const gridItems = visibleDesigns.flatMap((d, dIdx) =>
    d.items.map((it, iIdx) => ({ img: it.img, pos: it.pos, name: d.name, section: d._section, dIdx, iIdx }))
  );

  // Current image in expanded view
  const curFlat   = flatIdx !== null ? gridItems[flatIdx] : null;
  const curDesign = curFlat ? visibleDesigns[curFlat.dIdx] : null;
  const curItem   = curFlat ? curDesign?.items[curFlat.iIdx] : null;
  const curSlides = curItem ? (curItem.slides ?? [curItem.img]) : [];
  const displayImg = curSlides[slideIdx] ?? curFlat?.img;
  const _curSection = curFlat?.section ?? null;

  // Search results (always across all designs)
  const q = searchQuery.trim().toLowerCase();
  const searchResults = q
    ? SCREEN_DESIGNS_SECTIONED.flatMap((d, dIdx) => {
        const nameMatch = d.name.toLowerCase().includes(q);
        const tabMatch  = (d.tabs ?? []).some(t => t.includes(q) || q.includes(t));
        // Check if any items in this design have item-level tags (if so, don't fall back to design-level)
        const hasItemTags = d.items.some(it => (it.tags ?? []).length > 0);
        const designTagMatch = !hasItemTags && (d.tags ?? []).some(t => t.includes(q) || q.includes(t));
        return d.items.flatMap((it, iIdx) => {
          const itemMatch = it.name?.toLowerCase().includes(q) || it.description?.toLowerCase().includes(q);
          // Item-level tag: if item has tags, check those; else if design has no item-level tags, use design tags
          const itemTagMatch = (it.tags ?? []).length > 0
            ? (it.tags).some(t => t.includes(q) || q.includes(t))
            : designTagMatch;
          if (!nameMatch && !itemTagMatch && !tabMatch && !itemMatch) return [];
          return [{ img: it.img, pos: it.pos, name: it.name ?? d.name, dIdx, iIdx }];
        });
      })
    : [];

  // Auto-scroll thumb strip to keep active thumb visible
  useEffect(() => {
    if (activeThumbRef.current && thumbStripRef.current) {
      activeThumbRef.current.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [flatIdx]);

  // Navigate: two modes depending on how the view was entered.
  // jumpByDesign=true (grid click): arrows hop to the first image of the next/prev design.
  // jumpByDesign=false (name pill click): arrows step image-by-image within the current design.
  const navigateFlat = useCallback((dir) => {
    if (flatIdx === null) return;
    const curName = gridItems[flatIdx]?.name;

    if (jumpByDesign) {
      // Design-hop: skip to first image of next / prev design
      if (dir > 0) {
        let next = flatIdx + 1;
        while (next < gridItems.length && gridItems[next].name === curName) next++;
        if (next >= gridItems.length) next = 0;
        setAnimDir(1);
        setTimeout(() => { setFlatIdx(next); setSlideIdx(0); setAnimDir(null); }, 180);
      } else {
        const firstOfCurrent = gridItems.findIndex(it => it.name === curName);
        if (firstOfCurrent > 0) {
          const prevName = gridItems[firstOfCurrent - 1].name;
          const firstOfPrev = gridItems.findIndex(it => it.name === prevName);
          setAnimDir(-1);
          setTimeout(() => { setFlatIdx(firstOfPrev >= 0 ? firstOfPrev : 0); setSlideIdx(0); setAnimDir(null); }, 180);
        } else {
          // Already first design — wrap to last
          const lastName = gridItems[gridItems.length - 1]?.name;
          const firstOfLast = gridItems.findIndex(it => it.name === lastName);
          setAnimDir(-1);
          setTimeout(() => { setFlatIdx(firstOfLast >= 0 ? firstOfLast : 0); setSlideIdx(0); setAnimDir(null); }, 180);
        }
      }
    } else {
      // Image-step within current design (with slide support)
      if (dir > 0) {
        if (slideIdx < curSlides.length - 1) { setSlideIdx(s => s + 1); return; }
        const next = flatIdx + 1;
        if (next < gridItems.length && gridItems[next].name === curName) {
          setAnimDir(1);
          setTimeout(() => { setFlatIdx(next); setSlideIdx(0); setAnimDir(null); }, 180);
        } else {
          const first = gridItems.findIndex(it => it.name === curName);
          setAnimDir(1);
          setTimeout(() => { setFlatIdx(first >= 0 ? first : 0); setSlideIdx(0); setAnimDir(null); }, 180);
        }
      } else {
        if (slideIdx > 0) { setSlideIdx(s => s - 1); return; }
        const prev = flatIdx - 1;
        if (prev >= 0 && gridItems[prev].name === curName) {
          setAnimDir(-1);
          setTimeout(() => { setFlatIdx(prev); setSlideIdx(0); setAnimDir(null); }, 180);
        } else {
          let last = flatIdx;
          while (last + 1 < gridItems.length && gridItems[last + 1].name === curName) last++;
          setAnimDir(-1);
          setTimeout(() => { setFlatIdx(last); setSlideIdx(0); setAnimDir(null); }, 180);
        }
      }
    }
  }, [flatIdx, jumpByDesign, slideIdx, curSlides.length, gridItems]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") {
        if (searchQuery) { setSearchQuery(""); setSearchOpen(false); return; }
        if (showCat) { setShowCat(false); return; }
        if (flatIdx !== null) { setFlatIdx(null); setSlideIdx(0); return; }
        onClose();
      }
      if (flatIdx !== null && !searchQuery) {
        if (e.key === "ArrowRight") navigateFlat(1);
        if (e.key === "ArrowLeft")  navigateFlat(-1);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [flatIdx, showCat, searchQuery, navigateFlat, onClose]);

  return (
    <div
      className="fixed inset-0 z-[10000] bg-jet flex flex-col"
      onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
      onTouchEnd={e => { const dx = e.changedTouches[0].clientX - touchStartX.current; if (Math.abs(dx) > 50 && flatIdx !== null && !searchQuery) navigateFlat(dx < 0 ? 1 : -1); }}
    >
      {/* Top bar */}
      <div className="flex items-center px-5 py-3 border-b border-white/10 flex-shrink-0 gap-3">
        <span className="font-heading font-bold text-sm tracking-widest text-cream flex-none">
          ROGET<span className="font-light italic">james</span>
          <span className="font-detail text-[9px] font-normal not-italic uppercase tracking-[0.2em] text-cream/50 ml-2">· Screens</span>
        </span>
        <div className="flex-1 flex justify-center">
          <button onClick={() => setShowCat(true)}
            className="pill-trace font-detail text-[9px] uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border border-white/35 bg-transparent text-cream/88 transition-colors duration-200">
            Catalogue
          </button>
        </div>
        <div className="flex items-center gap-2 flex-none">
          {searchOpen
            ? <div className="relative flex items-center">
                <input ref={searchInputRef} type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)} onBlur={() => setTimeout(() => setSearchFocused(false), 180)}
                  placeholder="Search designs…"
                  className="bg-white/6 border border-white/15 rounded-full pl-3 pr-7 py-1.5 font-detail text-[12px] text-cream placeholder:text-cream/30 focus:outline-none focus:border-clay/50 transition-colors w-36"
                  autoFocus />
                <button onClick={() => { setSearchQuery(""); setSearchOpen(false); }} className="absolute right-2.5 text-cream/30 hover:text-cream/70 transition-colors"><X size={10} /></button>
              </div>
            : <button onClick={() => { setSearchOpen(true); setTimeout(() => searchInputRef.current?.focus(), 50); }}
                className="flex items-center gap-2 text-cream/40 hover:text-cream transition-colors" aria-label="Search">
                <span className="font-detail text-[9px] uppercase tracking-[0.2em]">Refine Search</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="6" cy="6" r="4"/><line x1="9.5" y1="9.5" x2="13" y2="13"/></svg>
              </button>
          }
          <button onClick={onClose} className="text-cream/40 hover:text-cream transition-colors"><X size={15} /></button>
        </div>
      </div>

      {/* Search suggestions dropdown */}
      {searchOpen && searchFocused && !searchQuery && (
        <div className="absolute left-0 right-0 z-50 bg-[#111] border-b border-white/10 px-10 md:px-20 py-4" style={{ top: "49px" }}>
          {SCREEN_SEARCH_SUGGESTIONS.map(group => (
            <div key={group.label} className="mb-3 last:mb-0">
              <p className="font-detail text-[9px] text-cream/40 uppercase tracking-[0.2em] mb-2">{group.label}</p>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map(term => (
                  <button key={term} onMouseDown={e => e.preventDefault()} onClick={() => { setSearchQuery(term); }}
                    className="px-3 py-1 rounded-full font-detail text-[9px] bg-white/5 border border-white/10 text-cream/60 hover:border-clay/60 hover:text-cream transition-all duration-200 uppercase tracking-[0.12em]">
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category tabs — clicking filters the view; also lights up as position indicator */}
      {!searchQuery && (
        <div className="flex justify-center gap-2 px-5 py-2.5 overflow-x-auto border-b border-white/8 flex-shrink-0" style={{ scrollbarWidth: "none" }}>
          {SCREEN_TABS.map(t => {
            const isFilter   = tab === t.id;
            // Highlight ALL sections the current design belongs to (e.g. ERGO → ICONS + ARCHITECTURAL)
            const isPosition = !isFilter && t.id !== "all" && (
              (activeDrillDesign?._sections?.includes(t.id)) ||
              (curDesign?._sections?.includes(t.id) && flatIdx !== null)
            );
            return (
              <button key={t.id}
                onClick={() => { setTab(t.id); setFlatIdx(null); setSlideIdx(0); setJumpByDesign(true); setActiveDesign(null); }}
                className={`pill-trace flex-shrink-0 px-4 py-1.5 rounded-full font-detail text-[9px] uppercase tracking-[0.16em] border transition-colors duration-200${isFilter ? " pill-active" : ""}`}
                style={{
                  background: "transparent",
                  borderColor: isFilter ? "#b85c38" : isPosition ? "rgba(242,240,233,0.8)" : "rgba(242,240,233,0.45)",
                  color:       isFilter ? "#f2f0e9"  : isPosition ? "#f2f0e9"               : "rgba(242,240,233,0.9)",
                  whiteSpace: "nowrap",
                }}>
                {t.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Design name pills — animated drawer */}
      {!searchQuery && (
        <div className="flex-shrink-0 border-b border-white/6">
          {/* Trigger row */}
          <div className="flex items-center gap-3 px-5 py-2">
            <button
              onClick={() => setDesignPillsOpen(o => !o)}
              className="group flex items-center gap-2.5 transition-colors duration-200"
            >
              <span
                className="flex items-center justify-center rounded-full border font-detail text-[8px] uppercase tracking-[0.14em] transition-all duration-200"
                style={{
                  width: 30, height: 30, flexShrink: 0,
                  borderColor: designPillsOpen ? "#b85c38" : "rgba(242,240,233,0.3)",
                  background: designPillsOpen ? "#b85c38" : "transparent",
                  color: designPillsOpen ? "#f2f0e9" : "rgba(242,240,233,0.6)",
                }}
                onMouseEnter={e => { if (!designPillsOpen) { e.currentTarget.style.background = "#b85c38"; e.currentTarget.style.borderColor = "#b85c38"; e.currentTarget.style.color = "#f2f0e9"; }}}
                onMouseLeave={e => { if (!designPillsOpen) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(242,240,233,0.3)"; e.currentTarget.style.color = "rgba(242,240,233,0.6)"; }}}
              >
                ✦
              </span>
              <span className="font-detail text-[9px] uppercase tracking-[0.18em] transition-colors duration-200"
                style={{ color: designPillsOpen ? "#f2f0e9" : "rgba(242,240,233,0.75)" }}>
                The Editions
              </span>
            </button>
            {/* Active design shown inline when drawer closed */}
            {!designPillsOpen && activeDesign && (
              <span className="font-detail text-[9px] uppercase tracking-[0.14em] px-3 py-1 rounded-full border"
                style={{ borderColor: "#b85c38", color: "#f2f0e9", background: "transparent" }}>
                {activeDesign}
              </span>
            )}
          </div>
          {/* Animated drawer */}
          <div style={{ overflow: "hidden", maxHeight: designPillsOpen ? "300px" : "0px", transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1)" }}>
            <div className="flex flex-wrap gap-2 px-5 pb-3">
              <button
                onClick={() => { setActiveDesign(null); setFlatIdx(null); setSlideIdx(0); setDesignPillsOpen(false); }}
                className="pill-trace flex-shrink-0 px-3 py-1 rounded-full font-detail text-[8px] uppercase tracking-[0.14em] border transition-colors duration-200"
                style={{ background: "transparent", borderColor: !activeDesign ? "#b85c38" : "rgba(242,240,233,0.45)", color: "#f2f0e9", whiteSpace: "nowrap" }}>
                All
              </button>
              {tabDesigns.map((d) => {
                const isActive = activeDesign === d.name;
                return (
                  <button key={d.name}
                    onClick={() => { setActiveDesign(d.name); setFlatIdx(null); setSlideIdx(0); }}
                    className={`pill-trace flex-shrink-0 px-3 py-1 rounded-full font-detail text-[8px] uppercase tracking-[0.14em] border transition-colors duration-200${isActive ? " pill-active" : ""}`}
                    style={{ background: "transparent", borderColor: isActive ? "#b85c38" : "rgba(242,240,233,0.45)", color: "#f2f0e9", whiteSpace: "nowrap" }}>
                    {d.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Search results */}
      {searchQuery && (
        <div className="flex-1 overflow-y-auto px-10 md:px-20 py-4" data-lenis-prevent>
          {searchResults.length === 0
            ? <p className="font-detail text-cream/30 text-xs uppercase tracking-[0.2em] text-center mt-10">No results</p>
            : <div className="flex flex-wrap justify-center gap-2">
                {searchResults.map((it, i) => (
                  <div key={i} onClick={() => {
                    // dIdx/iIdx are relative to SCREEN_DESIGNS_SECTIONED = ALL visibleDesigns
                    const allFlat = SCREEN_DESIGNS_SECTIONED.flatMap((d, dI) =>
                      d.items.map((_, iI) => ({ dIdx: dI, iIdx: iI }))
                    );
                    const fi = allFlat.findIndex(x => x.dIdx === it.dIdx && x.iIdx === it.iIdx);
                    setTab("all"); setFlatIdx(fi >= 0 ? fi : null); setSlideIdx(0);
                    setSearchQuery(""); setSearchOpen(false);
                  }}
                    className="group cursor-pointer relative aspect-square rounded-lg overflow-hidden border border-white/8 group-hover:border-clay/50 transition-all duration-200"
                    style={{ width: "calc(10% - 8px)", minWidth: 80, opacity: 0, animation: "fadeIn 0.6s ease forwards", animationDelay: `${(((i * 0.618) % 1) * 2.2).toFixed(2)}s` }}>
                    <img src={it.img} alt={it.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      style={it.pos ? { objectPosition: it.pos } : undefined} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-1.5">
                      <p className="font-detail text-[9px] font-semibold uppercase tracking-wide text-cream leading-tight">{it.name}</p>
                    </div>
                  </div>
                ))}
              </div>
          }
        </div>
      )}

      {/* Grid view */}
      {!searchQuery && flatIdx === null && (
        <div className="flex-1 overflow-y-auto px-10 md:px-20 py-4" data-lenis-prevent>
          {!activeDesign && <ScreensFeatureSlideshow />}
          <div className="flex flex-wrap justify-center gap-2">
            {gridItems.map((it, i) => (
              <React.Fragment key={i}>
                {false && i === 20 && tab === "all" && <ScreensFeatureSlideshow />}
                <div
                  onClick={() => {
                    if (!activeDesign) {
                      setActiveDesign(it.name); setFlatIdx(null); setSlideIdx(0);
                    } else {
                      setFlatIdx(i); setSlideIdx(0); setJumpByDesign(false);
                    }
                  }}
                  className="group cursor-pointer relative aspect-square rounded-lg overflow-hidden border border-white/8 group-hover:border-clay/50 transition-all duration-200"
                  style={{ width: "calc(10% - 8px)", minWidth: 80, opacity: 0, animation: "fadeIn 0.6s ease forwards", animationDelay: `${(((i * 0.618) % 1) * 2.2).toFixed(2)}s` }}>
                  <img src={it.img} alt={it.name} loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    style={it.pos ? { objectPosition: it.pos } : undefined} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-1.5">
                    <p className="font-detail text-[9px] font-semibold uppercase tracking-wide text-cream leading-tight">{it.name}</p>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Expanded / slideshow view */}
      {!searchQuery && flatIdx !== null && curFlat && curItem && (
        <>
          <div className="flex-1 flex relative overflow-hidden min-h-0">
            <div className="flex-1 flex flex-col items-center justify-center relative min-w-0">
              <button onClick={() => navigateFlat(-1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/8 hover:bg-white/16 flex items-center justify-center text-cream transition-colors"
                style={{ fontSize: 20 }}>‹</button>

              <div style={{ transition: "opacity 0.18s, transform 0.18s", opacity: animDir ? 0 : 1, transform: animDir ? `translateX(${animDir > 0 ? 28 : -28}px)` : "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "16px 64px", width: "100%" }}>
                <img src={displayImg} alt={curFlat.name}
                  style={{ maxHeight: "68vh", maxWidth: "100%", objectFit: "contain", borderRadius: 12, boxShadow: "0 20px 56px rgba(0,0,0,0.7)" }} />
                <p className="font-heading font-semibold text-base text-cream/90 tracking-wide">{curFlat.name}</p>
              </div>

              <button onClick={() => navigateFlat(1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/8 hover:bg-white/16 flex items-center justify-center text-cream transition-colors"
                style={{ fontSize: 20 }}>›</button>
            </div>
          </div>

          {/* Thumbs strip — all images in current view; active one highlighted + auto-scrolled into view */}
          <div className="flex-shrink-0 border-t border-white/10" style={{ marginTop: 24 }}>
            <div ref={thumbStripRef} className="flex items-center gap-1.5 px-5 py-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
              {gridItems.map((it, fi) => {
                const isActive     = fi === flatIdx;
                const isSameDesign = it.name === curFlat.name;
                return (
                  <div key={fi}
                    ref={isActive ? activeThumbRef : null}
                    onClick={() => { setFlatIdx(fi); setSlideIdx(0); setJumpByDesign(true); }}
                    className="flex-shrink-0 rounded-lg overflow-hidden cursor-pointer"
                    style={{ width: 52, height: 52, border: `1.5px solid ${isActive ? "#b85c38" : "transparent"}`, opacity: isActive ? 1 : isSameDesign ? 0.75 : 0.35, transition: "all 0.2s" }}>
                    <img src={it.img} alt={it.name} className="w-full h-full object-cover" />
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {showCat && <ScreensCatalogueModal onClose={() => setShowCat(false)} />}
    </div>
  );
}

const SCULPTURE_SEARCH_SUGGESTIONS = [
  { label: "By Design", items: ["homebase", "xavier", "orian", "marakesh", "hue", "yazad", "dandelions", "centennial park", "fiona stanley", "unity in diversity", "aslyiam", "vuelta"] },
  { label: "By Type", items: ["totem", "sculpture", "planter", "feature"] },
];

function ProjectInfoPopup({ project, onClose }) {
  if (!project) return null;
  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 10100, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: "#141414", border: "1px solid rgba(242,240,233,0.1)", borderRadius: 18, width: "100%", maxWidth: 820, maxHeight: "90dvh", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}
      >
        {/* Header */}
        <div style={{ flexShrink: 0, padding: "28px 32px 20px", borderBottom: "1px solid rgba(242,240,233,0.08)" }}>
          <button onClick={onClose} style={{ position: "absolute", top: 16, right: 18, background: "none", border: "none", color: "rgba(242,240,233,0.35)", cursor: "pointer", fontSize: 20, lineHeight: 1 }}>✕</button>
          {project.location && (
            <p style={{ fontFamily: "var(--font-detail)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#CC5833", margin: "0 0 8px" }}>
              {project.location}
            </p>
          )}
          <p style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "clamp(20px,3vw,30px)", color: "#F2F0E9", margin: 0, letterSpacing: "0.05em", textTransform: "uppercase", lineHeight: 1.15 }}>
            {project.name}
          </p>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px 32px" }} data-lenis-prevent>

          {/* Description */}
          {project.description && (
            <p style={{ fontFamily: "var(--font-detail)", fontSize: 14, color: "rgba(242,240,233,0.7)", lineHeight: 1.85, margin: "0 0 28px" }}>
              {project.description}
            </p>
          )}

          {/* Behind the Scenes images */}
          {!project.hideBehindTheScenes && (
            <>
              <p style={{ fontFamily: "var(--font-detail)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(242,240,233,0.6)", margin: "0 0 12px" }}>Behind the Scenes</p>
              {project.behindTheScenes && project.behindTheScenes.length > 0 ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10 }}>
                  {project.behindTheScenes.map((it, i) => (
                    <div key={i} style={{ position: "relative", aspectRatio: "1", borderRadius: 10, overflow: "hidden", border: "1px solid rgba(242,240,233,0.08)" }}>
                      <img src={it.img} alt={it.name} loading="lazy"
                        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: it.pos || "center" }} />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)", opacity: 0, transition: "opacity 0.2s" }}
                        onMouseEnter={e => e.currentTarget.style.opacity = 1}
                        onMouseLeave={e => e.currentTarget.style.opacity = 0}>
                        <p style={{ position: "absolute", bottom: 8, left: 8, right: 8, fontFamily: "var(--font-detail)", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.12em", color: "#F2F0E9", lineHeight: 1.3 }}>{it.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProjectsGalleryModal({ onClose }) {
  const [activeProjectCat, setActiveProjectCat] = useState("all");
  const [itemIdx, setItemIdx] = useState(null);
  const [slideIdx, setSlideIdx] = useState(0);
  const [animDir, setAnimDir] = useState(null);
  const [infoProject, setInfoProject] = useState(null);

  const items = activeProjectCat === "all"
    ? PROJECTS_ROWS.flatMap(r => r.items.map(it => ({ ...it, _cat: r.projectCategory, _rowId: r.id })))
    : PROJECTS_ROWS.filter(r => r.projectCategory === activeProjectCat).flatMap(r => r.items.map(it => ({ ...it, _cat: r.projectCategory, _rowId: r.id })));

  const item = itemIdx !== null ? items[itemIdx] : null;
  const currentItemCat = item?._cat ?? null;
  const slides = item ? (item.slides || [item.img]) : [];
  const total = items.length;

  useEffect(() => { setItemIdx(null); setSlideIdx(0); }, [activeProjectCat]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") {
        if (itemIdx !== null) { setItemIdx(null); setSlideIdx(0); return; }
        onClose();
      }
      if (itemIdx !== null) {
        if (e.key === "ArrowRight") { setAnimDir(1); setTimeout(() => { setItemIdx(i => (i + 1) % total); setSlideIdx(0); setAnimDir(null); }, 180); }
        if (e.key === "ArrowLeft")  { setAnimDir(-1); setTimeout(() => { setItemIdx(i => (i - 1 + total) % total); setSlideIdx(0); setAnimDir(null); }, 180); }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [itemIdx, onClose, total]);

  const navigate = (dir) => {
    setAnimDir(dir);
    setTimeout(() => { setItemIdx(i => (i + dir + total) % total); setSlideIdx(0); setAnimDir(null); }, 180);
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-jet flex flex-col">
      {/* Top bar */}
      <div className="flex items-center px-5 py-3 border-b border-white/10 flex-shrink-0 gap-3">
        <span className="font-heading font-bold text-sm tracking-widest text-cream flex-none">
          ROGET<span className="font-light italic">james</span>
          <span className="font-detail text-[9px] font-normal not-italic uppercase tracking-[0.2em] text-cream/50 ml-2">· Projects</span>
        </span>
        <div className="flex-1" />
        <button onClick={onClose} className="text-cream/40 hover:text-cream transition-colors"><X size={15} /></button>
      </div>

      {/* Category pills */}
      <div className="flex items-center gap-2 px-5 py-2.5 border-b border-white/8 flex-shrink-0">
        <div className="flex gap-2 overflow-x-auto flex-1" style={{ scrollbarWidth: "none" }}>
        {[{ id: "all", label: "All" }, ...PROJECT_CATEGORIES].map(cat => {
          const isActive = activeProjectCat === cat.id;
          const isPosition = !isActive && cat.id !== "all" && currentItemCat === cat.id && itemIdx !== null;
          return (
            <button
              key={cat.id}
              onClick={() => { setActiveProjectCat(cat.id); setItemIdx(null); setSlideIdx(0); }}
              className={`pill-trace flex-shrink-0 px-4 py-1.5 rounded-full font-detail text-[9px] uppercase tracking-[0.16em] border transition-colors duration-200${isActive ? " pill-active" : ""}`}
              style={{
                background: "transparent",
                borderColor: isActive ? "#b85c38" : isPosition ? "rgba(242,240,233,0.8)" : "rgba(242,240,233,0.45)",
                color:       isActive ? "#f2f0e9"  : isPosition ? "#f2f0e9"               : "rgba(242,240,233,0.9)",
                whiteSpace: "nowrap",
              }}
            >
              {cat.label}
            </button>
          );
        })}
        </div>
        {activeProjectCat !== "all" && (() => {
          const row = PROJECTS_ROWS.find(r => r.projectCategory === activeProjectCat);
          return row ? (
            <button
              onClick={() => setInfoProject(row)}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full font-detail text-[9px] uppercase tracking-[0.16em] border transition-all duration-200"
              style={{ borderColor: "rgba(242,240,233,0.25)", color: "rgba(242,240,233,0.9)", whiteSpace: "nowrap" }}
            >
              <span style={{ fontSize: 11 }}>ⓘ</span> Project Info
            </button>
          ) : null;
        })()}
      </div>

      {/* Grid view */}
      {itemIdx === null && (
        <div className="flex-1 overflow-y-auto px-5 md:px-10 py-4" data-lenis-prevent>
          {items.length === 0 ? (
            <div className="flex items-center justify-center h-40">
              <p className="font-detail text-[11px] text-cream/30 uppercase tracking-widest">Images coming soon</p>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-2">
              {items.map((it, i) => (
                <div key={i} onClick={() => { setItemIdx(i); setSlideIdx(0); }}
                  className="group cursor-pointer relative aspect-square rounded-lg overflow-hidden border border-white/8 hover:border-clay/50 transition-all duration-200"
                  style={{ width: "calc(10% - 8px)", minWidth: 80, opacity: 0, animation: "fadeIn 0.6s ease forwards", animationDelay: `${(((i * 0.618) % 1) * 2.2).toFixed(2)}s` }}>
                  <img src={it.img} alt={it.name} loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    style={it.pos ? { objectPosition: it.pos } : undefined} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-1.5">
                    <p className="font-detail text-[9px] font-semibold uppercase tracking-wide text-cream leading-tight">{it.name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Lightbox */}
      {itemIdx !== null && item && (
        <>
          <div className="flex-1 flex relative overflow-hidden min-h-0">
            <div className="flex-1 flex flex-col items-center justify-center relative min-w-0">
              <button onClick={() => navigate(-1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/8 hover:bg-white/16 flex items-center justify-center text-cream transition-colors"
                style={{ fontSize: 20 }}>‹</button>
              <div style={{ transition: "opacity 0.18s, transform 0.18s", opacity: animDir ? 0 : 1, transform: animDir ? `translateX(${animDir > 0 ? 28 : -28}px)` : "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "16px 64px", width: "100%" }}>
                <img src={slides[slideIdx] ?? item.img} alt={item.name}
                  style={{ maxHeight: "68vh", maxWidth: "100%", objectFit: "contain", borderRadius: 12, boxShadow: "0 20px 56px rgba(0,0,0,0.7)" }} />
                <p className="font-heading font-semibold text-base text-cream/90 tracking-wide">{item.name}</p>
              </div>
              <button onClick={() => navigate(1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/8 hover:bg-white/16 flex items-center justify-center text-cream transition-colors"
                style={{ fontSize: 20 }}>›</button>
            </div>
          </div>
          <div className="flex-shrink-0 border-t border-white/10">
            <div className="flex items-center gap-1.5 px-5 py-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
              {items.flatMap((it, iIdx) => {
                const thumbSlides = it.slides || [it.img];
                const els = thumbSlides.map((src, sIdx) => {
                  const isActive = iIdx === itemIdx && sIdx === slideIdx;
                  return (
                    <div key={`${iIdx}-${sIdx}`} onClick={() => { setItemIdx(iIdx); setSlideIdx(sIdx); }}
                      className="flex-shrink-0 rounded-lg overflow-hidden cursor-pointer"
                      style={{ width: 52, height: 52, border: `1.5px solid ${isActive ? "#b85c38" : "transparent"}`, opacity: isActive ? 1 : iIdx === itemIdx ? 0.75 : 0.45, transition: "all 0.2s" }}>
                      <img src={src} alt={it.name} className="w-full h-full object-cover" />
                    </div>
                  );
                });
                if (iIdx > 0) els.unshift(<div key={`sep-${iIdx}`} style={{ width: 1, height: 34, background: "rgba(242,240,233,0.12)", flexShrink: 0, borderRadius: 1, margin: "0 3px" }} />);
                return els;
              })}
            </div>
          </div>
        </>
      )}
      <ProjectInfoPopup project={infoProject} onClose={() => setInfoProject(null)} />
    </div>
  );
}

export function ConceptsGalleryModal({ onClose }) {
  return <SculptureGalleryModal onClose={onClose} items={CONCEPTS_ITEMS} label="Concepts" />;
}

export function SculptureGalleryModal({ onClose, items: itemsProp = null, label: labelProp = "Sculpture" }) {
  const items = itemsProp ?? SCULPTURE_ITEMS;
  const [itemIdx, setItemIdx] = useState(null);
  const [slideIdx, setSlideIdx] = useState(0);
  const [animDir, setAnimDir] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchInputRef = useRef(null);
  const touchStartX = useRef(0);

  const item = itemIdx !== null ? items[itemIdx] : null;

  const slides = item ? (item.slides || [item.img]) : [];
  const total = items.length;

  const searchResults = searchQuery
    ? items.map((it, i) => ({ ...it, origIdx: i })).filter(it => it.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") {
        if (searchQuery) { setSearchQuery(""); return; }
        if (searchOpen) { setSearchOpen(false); return; }
        if (itemIdx !== null) { setItemIdx(null); setSlideIdx(0); return; }
        onClose();
      }
      if (itemIdx !== null && !searchOpen) {
        if (e.key === "ArrowRight") { setAnimDir(1); setTimeout(() => { setItemIdx(i => (i + 1) % total); setSlideIdx(0); setAnimDir(null); }, 180); }
        if (e.key === "ArrowLeft")  { setAnimDir(-1); setTimeout(() => { setItemIdx(i => (i - 1 + total) % total); setSlideIdx(0); setAnimDir(null); }, 180); }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [itemIdx, onClose, total, searchQuery, searchOpen]);

  const navigate = (dir) => {
    setAnimDir(dir);
    setTimeout(() => { setItemIdx(i => (i + dir + total) % total); setSlideIdx(0); setAnimDir(null); }, 180);
  };

  return (
    <div
      className="fixed inset-0 z-[10000] bg-jet flex flex-col"
      onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
      onTouchEnd={e => { const dx = e.changedTouches[0].clientX - touchStartX.current; if (Math.abs(dx) > 50 && itemIdx !== null) navigate(dx < 0 ? 1 : -1); }}
    >
      {/* Top bar */}
      <div className="flex items-center px-5 py-3 border-b border-white/10 flex-shrink-0 gap-3 relative">
        <span className="font-heading font-bold text-sm tracking-widest text-cream flex-none">
          ROGET<span className="font-light italic">james</span>
          <span className="font-detail text-[9px] font-normal not-italic uppercase tracking-[0.2em] text-cream/50 ml-2">· {labelProp}</span>
        </span>
        <div className="flex-1" />

        {/* Search */}
        <div className="flex items-center gap-2 relative">
          <div style={{ display: "flex", alignItems: "center", background: searchOpen ? "rgba(242,240,233,0.08)" : "transparent", borderRadius: 20, transition: "all 0.2s", padding: searchOpen ? "4px 10px" : "4px 6px", border: searchOpen ? "1px solid rgba(242,240,233,0.15)" : "1px solid transparent" }}>
            <button onClick={() => { setSearchOpen(s => !s); if (!searchOpen) setTimeout(() => searchInputRef.current?.focus(), 50); else { setSearchQuery(""); setSearchFocused(false); } }}
              className="text-cream/50 hover:text-cream transition-colors flex-shrink-0" style={{ lineHeight: 1 }}>
              <Search size={13} />
            </button>
            {searchOpen && (
              <input ref={searchInputRef} value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)} onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
                placeholder="search sculpture…"
                className="bg-transparent text-cream text-[13px] outline-none ml-2 w-32 placeholder-cream/30 font-detail" />
            )}
          </div>
          {/* Suggestions dropdown */}
          {searchOpen && searchFocused && !searchQuery && (
            <div className="absolute right-0 bg-jet border border-white/12 rounded-xl shadow-2xl z-50 min-w-[200px] py-2" style={{ top: "49px" }}>
              {SCULPTURE_SEARCH_SUGGESTIONS.map(group => (
                <div key={group.label} className="px-3 py-1">
                  <p className="font-detail text-[9px] uppercase tracking-[0.14em] text-cream/30 mb-1">{group.label}</p>
                  <div className="flex flex-wrap gap-1">
                    {group.items.map(item => (
                      <button key={item} onMouseDown={() => { setSearchQuery(item); }}
                        className="font-detail text-[10px] text-cream/60 hover:text-cream bg-white/5 hover:bg-white/10 rounded-full px-2 py-0.5 transition-colors capitalize">
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button onClick={onClose} className="text-cream/40 hover:text-cream transition-colors"><X size={15} /></button>
      </div>

      {/* Search results */}
      {searchQuery && (
        <div className="flex-1 overflow-y-auto px-10 md:px-20 py-4" data-lenis-prevent>
          {searchResults.length === 0 ? (
            <div className="flex items-center justify-center h-40">
              <p className="font-detail text-[11px] text-cream/30 uppercase tracking-widest">No results for "{searchQuery}"</p>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-2">
              {searchResults.map((it, i) => (
                <div key={it.origIdx} onClick={() => { setItemIdx(it.origIdx); setSlideIdx(0); setSearchQuery(""); setSearchOpen(false); }}
                  className="group cursor-pointer relative aspect-square rounded-lg overflow-hidden border border-white/8 group-hover:border-clay/50 transition-all duration-200"
                  style={{ width: "calc(10% - 8px)", minWidth: 80, opacity: 0, animation: "fadeIn 0.6s ease forwards", animationDelay: `${(((i * 0.618) % 1) * 2.2).toFixed(2)}s` }}>
                  <img src={it.img} alt={it.name} loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    style={it.pos ? { objectPosition: it.pos } : undefined} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-1.5">
                    <p className="font-detail text-[9px] font-semibold uppercase tracking-wide text-cream leading-tight">{it.name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Grid view */}
      {!searchQuery && itemIdx === null && (
        <div className="flex-1 overflow-y-auto px-10 md:px-20 py-4" data-lenis-prevent>
          <div className="flex flex-wrap justify-center gap-2">
            {items.map((it, i) => (
              <div key={i} onClick={() => { setItemIdx(i); setSlideIdx(0); }}
                className="group cursor-pointer relative aspect-square rounded-lg overflow-hidden border border-white/8 group-hover:border-clay/50 transition-all duration-200"
                style={{ width: "calc(10% - 8px)", minWidth: 80, opacity: 0, animation: "fadeIn 0.6s ease forwards", animationDelay: `${(((i * 0.618) % 1) * 2.2).toFixed(2)}s` }}>
                <img src={it.img} alt={it.name} loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  style={it.pos ? { objectPosition: it.pos } : undefined} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-1.5">
                  <p className="font-detail text-[9px] font-semibold uppercase tracking-wide text-cream leading-tight">{it.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Card view */}
      {!searchQuery && itemIdx !== null && item && (
        <>
          <div className="flex-1 flex relative overflow-hidden min-h-0">
            <div className="flex-1 flex flex-col items-center justify-center relative min-w-0">
              <button onClick={() => navigate(-1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/8 hover:bg-white/16 flex items-center justify-center text-cream transition-colors"
                style={{ fontSize: 20 }}>‹</button>

              <div style={{ transition: "opacity 0.18s, transform 0.18s", opacity: animDir ? 0 : 1, transform: animDir ? `translateX(${animDir > 0 ? 28 : -28}px)` : "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "16px 64px", width: "100%" }}>
                <img src={slides[slideIdx] ?? item.img} alt={item.name}
                  style={{ maxHeight: "68vh", maxWidth: "100%", objectFit: "contain", borderRadius: 12, boxShadow: "0 20px 56px rgba(0,0,0,0.7)" }} />
                <p className="font-heading font-semibold text-base text-cream/90 tracking-wide">{item.name}</p>
              </div>

              <button onClick={() => navigate(1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/8 hover:bg-white/16 flex items-center justify-center text-cream transition-colors"
                style={{ fontSize: 20 }}>›</button>
            </div>
          </div>

          {/* Thumbs strip */}
          <div className="flex-shrink-0 border-t border-white/10">
            <div className="flex items-center gap-1.5 px-5 py-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
              {items.flatMap((it, iIdx) => {
                const thumbSlides = it.slides || [it.img];
                const els = thumbSlides.map((src, sIdx) => {
                  const isActive = iIdx === itemIdx && sIdx === slideIdx;
                  return (
                    <div key={`${iIdx}-${sIdx}`} onClick={() => { setItemIdx(iIdx); setSlideIdx(sIdx); }}
                      className="flex-shrink-0 rounded-lg overflow-hidden cursor-pointer"
                      style={{ width: 52, height: 52, border: `1.5px solid ${isActive ? "#b85c38" : "transparent"}`, opacity: isActive ? 1 : iIdx === itemIdx ? 0.75 : 0.45, transition: "all 0.2s" }}>
                      <img src={src} alt={it.name} className="w-full h-full object-cover" />
                    </div>
                  );
                });
                return els;
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ScreensPortal() {
  const [cur, setCur] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [glowing, setGlowing] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setCur(p => (p + 1) % SCREENS_PORTAL_IMGS.length), 3200);
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <>
      <button
        onClick={() => setGalleryOpen(true)}
        onMouseEnter={() => setGlowing(true)}
        onMouseLeave={() => setGlowing(false)}
        className="group relative cursor-pointer"
        style={{
          borderRadius: "50%",
          padding: "9px",
          background: "linear-gradient(180deg, #6a6a6a 0%, #3a3a3a 28%, #1c1c1c 60%, #222222 100%)",
          boxShadow: glowing
            ? "inset 0 -5px 10px rgba(0,0,0,0.65), 0 8px 24px rgba(0,0,0,0.95), 0 2px 6px rgba(0,0,0,0.7), 0 0 0 5px #111111, 0 0 0 8px rgba(255,255,255,0.28), 0 0 55px 14px rgba(255,255,255,0.13), 0 0 90px 28px rgba(255,255,255,0.06)"
            : "inset 0 -5px 10px rgba(0,0,0,0.65), 0 8px 24px rgba(0,0,0,0.95), 0 2px 6px rgba(0,0,0,0.7), 0 0 0 5px #111111, 0 0 0 8px rgba(255,255,255,0.28)",
          transition: "box-shadow 0.6s ease",
        }}
        aria-label="View Screens"
      >
        <div className="relative overflow-hidden w-56 h-56 md:w-64 md:h-64" style={{ borderRadius: "50%" }}>
          {SCREENS_PORTAL_IMGS.map((img, i) => (
            <img key={i} src={img} alt=""
              className="absolute inset-0 w-full h-full object-cover"
              style={{ opacity: i === cur ? 1 : 0, transition: "opacity 1.2s ease" }} />
          ))}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/90">
            <img src="/images/roj-logo.png" alt="ROGETjames" className="w-28 h-auto" style={{ opacity: 0.55, filter: "brightness(0.75)" }} />
            <span className="font-detail text-[10px] text-cream/75 uppercase tracking-[0.22em] border border-white/20 rounded-full px-4 py-1.5">
              Screens
            </span>
          </div>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {SCREENS_PORTAL_IMGS.map((_, i) => (
              <span key={i} className="w-1 h-1 rounded-full transition-colors duration-500"
                style={{ background: i === cur ? "rgba(242,240,233,0.9)" : "rgba(242,240,233,0.3)" }} />
            ))}
          </div>
        </div>
      </button>
      {galleryOpen && <ScreensGalleryModal onClose={() => setGalleryOpen(false)} />}
    </>
  );
}

const BESPOKE_PORTAL_ITEMS = [
  { type: "video", src: "/videos/natives-collage-2.mp4", label: "CUSTOM Natives — Collage", detail: "A commission in our native botanicals series — hand-composed and laser cut to order." },
];

function BespokePortal() {
  const [cur, setCur] = useState(0);
  const [popOpen, setPopOpen] = useState(false);
  const [playingItem, setPlayingItem] = useState(null);
  const [glowing, setGlowing] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    clearInterval(timerRef.current);
    if (BESPOKE_PORTAL_ITEMS[cur]?.type !== "video") {
      timerRef.current = setInterval(() => setCur(p => (p + 1) % BESPOKE_PORTAL_ITEMS.length), 3200);
    }
    return () => clearInterval(timerRef.current);
  }, [cur]);

  const _go = (n) => setCur(p => (p + n + BESPOKE_PORTAL_ITEMS.length) % BESPOKE_PORTAL_ITEMS.length);

  return (
    <>
      <button
        onClick={() => setPopOpen(true)}
        onMouseEnter={() => setGlowing(true)}
        onMouseLeave={() => setGlowing(false)}
        className="group relative cursor-pointer"
        style={{
          borderRadius: "50%",
          padding: "9px",
          background: "linear-gradient(180deg, #6a6a6a 0%, #3a3a3a 28%, #1c1c1c 60%, #222222 100%)",
          boxShadow: glowing
            ? "inset 0 -5px 10px rgba(0,0,0,0.65), 0 8px 24px rgba(0,0,0,0.95), 0 2px 6px rgba(0,0,0,0.7), 0 0 0 5px #111111, 0 0 0 8px rgba(255,255,255,0.28), 0 0 55px 14px rgba(255,255,255,0.13), 0 0 90px 28px rgba(255,255,255,0.06)"
            : "inset 0 -5px 10px rgba(0,0,0,0.65), 0 8px 24px rgba(0,0,0,0.95), 0 2px 6px rgba(0,0,0,0.7), 0 0 0 5px #111111, 0 0 0 8px rgba(255,255,255,0.28)",
          transition: "box-shadow 0.6s ease",
        }}
        aria-label="View Catalogue"
      >
        <div className="relative overflow-hidden w-64 h-64 md:w-72 md:h-72" style={{ borderRadius: "50%" }}>
          {BESPOKE_PORTAL_ITEMS.map((item, i) => (
            item.type === "video"
              ? <video key={i} src={item.src} autoPlay muted loop playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ opacity: i === cur ? 1 : 0, transition: "opacity 1.2s ease" }} />
              : <img key={i} src={item.img} alt={item.label}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ opacity: i === cur ? 1 : 0, transition: "opacity 1.2s ease" }} />
          ))}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/90">
            <img src="/images/roj-logo.png" alt="ROGETjames" className="w-36 h-auto" style={{ opacity: 0.55, filter: "brightness(0.75)" }} />
            <span className="font-detail text-[10px] text-cream/75 uppercase tracking-[0.22em] border border-white/20 rounded-full px-4 py-1.5">
              View
            </span>
          </div>
          {BESPOKE_PORTAL_ITEMS.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
              {BESPOKE_PORTAL_ITEMS.map((_, i) => (
                <span key={i} className="w-1 h-1 rounded-full transition-colors duration-500"
                  style={{ background: i === cur ? "rgba(242,240,233,0.9)" : "rgba(242,240,233,0.3)" }} />
              ))}
            </div>
          )}
        </div>
      </button>

      {popOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/97 backdrop-blur-md p-4"
          onClick={() => { setPopOpen(false); setPlayingItem(null); }}>

          {/* ── Playing a video full screen ── */}
          {playingItem ? (
            <div className="relative flex flex-col items-center gap-4 max-w-[90vw]" onClick={e => e.stopPropagation()}>
              <button onClick={() => setPlayingItem(null)}
                className="self-start flex items-center gap-2 text-cream/60 hover:text-cream transition-colors text-sm font-detail tracking-wider uppercase mb-2">
                <ChevronLeft size={16} /> Back
              </button>
              <video src={playingItem.src} autoPlay controls controlsList="nodownload noremoteplayback nofullscreen" disablePictureInPicture playsInline
                className="max-h-[72vh] max-w-full rounded-2xl"
                onEnded={() => setPlayingItem(null)} />
              {playingItem.label && <p className="font-detail text-[10px] text-cream/55 uppercase tracking-[0.2em]">{playingItem.label}</p>}
            </div>

          ) : (
          /* ── Selection grid ── */
          <div className="relative flex flex-col rounded-2xl overflow-hidden bg-charcoal"
            style={{ width: "min(78vh, 620px)" }}
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/8">
              <p className="font-detail text-[10px] text-warm-gray uppercase tracking-[0.2em]">Select a Reel</p>
              <button onClick={() => setPopOpen(false)} className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center text-cream/60 hover:text-cream hover:bg-white/15 transition-all">
                <X size={14} />
              </button>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3 overflow-y-auto" style={{ maxHeight: "70vh" }} data-lenis-prevent>
              {BESPOKE_PORTAL_ITEMS.map((item, i) => (
                <button key={i} onClick={() => item.type === "video" ? setPlayingItem(item) : null}
                  className="group relative rounded-xl overflow-hidden border border-white/8 hover:border-clay/50 transition-all duration-300 text-left"
                  style={{ aspectRatio: "16/9" }}>
                  {item.img
                    ? <img src={item.img} alt={item.label} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    : <video src={item.src} muted playsInline preload="metadata" className="absolute inset-0 w-full h-full object-cover" />
                  }
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  {item.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white/15 border border-white/30 flex items-center justify-center group-hover:bg-clay/80 group-hover:border-clay transition-all duration-300">
                        <Play size={16} className="text-cream ml-0.5" />
                      </div>
                    </div>
                  )}
                  {item.label && (
                    <div className="absolute bottom-0 left-0 right-0 px-3 pb-2">
                      <p className="font-heading font-bold text-xs text-cream leading-snug">{item.label}</p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
          )}
        </div>
      )}
    </>
  );
}

const TITLE_STRIP_WORDS = [
  "ASLYIAM", "ERGO", "FERLIE", "GRAIL", "HOMEBASE", "MARAKESH",
  "ZARATHSTRA", "LUMIER", "WATTLE", "COTTESLOE", "BANKSIA",
  "UNITY IN DIVERSITY", "CREEPING FIG", "ORIAN", "CHIOLA",
  "DANDELIONS", "XAVIER", "CENTENNIAL PARK", "VUELTA", "EQUISETTI",
  "WANDOO", "HUE", "REEDS OF UNGARO", "FIONA STANLEY", "VIASI",
  "LUCARIO", "VAYA", "AUDA", "ROANDER", "COMMERCIAL", "PUBLIC",
  "RESIDENTIAL", "SCREENS", "SCULPTURE", "LIGHT FEATURES", "CONCEPTS",
];

function TitleDrift() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const W = container.offsetWidth || 1200;
    const H = container.offsetHeight || 112;
    const SLOTS = 6;
    const els = [];
    const lightEls = [];

    // Shuffle helper
    const shuffle = arr => {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };
    let queue = shuffle(TITLE_STRIP_WORDS);
    let qi = 0;
    const nextWord = () => {
      if (qi >= queue.length) { queue = shuffle(TITLE_STRIP_WORDS); qi = 0; }
      return queue[qi++];
    };

    // Create 6 word elements — each with a warm light overlay span
    for (let i = 0; i < SLOTS; i++) {
      const wrap = document.createElement("span");
      wrap.style.cssText = "position:absolute;top:50%;left:50%;white-space:nowrap;transform-origin:center center;pointer-events:none;user-select:none;will-change:transform,opacity;opacity:0;";

      const text = document.createElement("span");
      text.style.cssText = "position:relative;display:inline-block;font-family:Impact,'Arial Narrow',sans-serif;font-size:110px;line-height:1;letter-spacing:0.10em;color:rgb(242,240,233);white-space:nowrap;";
      text.className = "uppercase";
      text.textContent = nextWord();

      const light = document.createElement("span");
      light.style.cssText = "position:absolute;inset:0;font-family:Impact,'Arial Narrow',sans-serif;font-size:110px;line-height:1;letter-spacing:0.10em;white-space:nowrap;-webkit-background-clip:text;background-clip:text;color:transparent;-webkit-text-fill-color:transparent;";
      light.textContent = text.textContent;

      text.appendChild(light);
      wrap.appendChild(text);
      container.appendChild(wrap);
      els.push(wrap);
      lightEls.push(light);
    }

    // Depth: scale + opacity yoyo seeked to random phase — all words visible immediately
    // far = tiny + dim, near = large + bright
    const DEPTH = [
      [0.12, 2.6, 0.03, 0.20, 42],
      [0.12, 2.0, 0.03, 0.17, 34],
      [0.12, 2.4, 0.03, 0.19, 29],
      [0.12, 1.7, 0.03, 0.15, 25],
      [0.12, 2.2, 0.03, 0.18, 38],
      [0.12, 1.5, 0.03, 0.14, 21],
    ];
    els.forEach((w, i) => {
      const [minS, maxS, dimOp, brightOp, dur] = DEPTH[i];
      gsap.set(w, { xPercent: -50, yPercent: -50, filter: "drop-shadow(0 0 0px rgba(210,165,70,0))" });
      const tl = gsap.fromTo(w,
        { scale: minS, opacity: dimOp },
        { scale: maxS, opacity: brightOp, duration: dur, ease: "sine.inOut", yoyo: true, repeat: -1 }
      );
      tl.seek(Math.random() * dur * 2);
    });

    // Drift — continuous overlapping moves, never stops
    const drift = (el, range, minDur, maxDur) => {
      const go = () => {
        const x = (Math.random() - 0.5) * range;
        const y = (Math.random() - 0.5) * H * 0.6;
        const dur = minDur + Math.random() * (maxDur - minDur);
        gsap.to(el, { x, y, duration: dur, ease: "sine.inOut" });
        setTimeout(go, dur * 680);
      };
      setTimeout(go, Math.random() * 4000);
    };
    drift(els[0], W * 0.8, 40, 65);
    drift(els[1], W * 0.65, 32, 52);
    drift(els[2], W * 0.55, 28, 46);
    drift(els[3], W * 0.45, 24, 40);
    drift(els[4], W * 0.70, 36, 58);
    drift(els[5], W * 0.50, 26, 44);

    // Warm roaming light over ALL word letters simultaneously
    const lts = [
      { x: 15, y: 50, size: 240, op: 0.55 },
      { x: 72, y: 50, size: 180, op: 0.44 },
    ];
    const updateLights = () => {
      const img = lts.map(l =>
        `radial-gradient(ellipse ${l.size}px ${Math.round(l.size * 0.5)}px at ${l.x}% ${l.y}%, rgba(235,200,130,${l.op}) 0%, transparent 65%)`
      ).join(", ");
      lightEls.forEach(l => { l.style.backgroundImage = img; });
    };
    updateLights();
    const roamLight = (l, ax) => {
      const linger = Math.random() < 0.25;
      const target = linger ? l[ax] + (Math.random() - 0.5) * 10 : 5 + Math.random() * 90;
      gsap.to(l, {
        [ax]: target,
        duration: linger ? 3 + Math.random() * 5 : 9 + Math.random() * 20,
        ease: "sine.inOut",
        onUpdate: updateLights,
        onComplete: () => roamLight(l, ax),
      });
    };
    lts.forEach((l, i) => setTimeout(() => { roamLight(l, "x"); roamLight(l, "y"); }, i * 900));

    // Random illuminate — one word gently brightens with warm glow, then fades
    const BASE_DIM = DEPTH.map(d => d[2]);
    const illuminate = () => {
      const pick = Math.floor(Math.random() * SLOTS);
      const el = els[pick];
      gsap.to(el, {
        opacity: 0.28 + Math.random() * 0.12,
        filter: `drop-shadow(0 0 ${16 + Math.random() * 12}px rgba(210,165,70,0.55))`,
        duration: 3 + Math.random() * 3,
        ease: "sine.inOut",
        overwrite: false,
        onComplete: () => {
          gsap.to(el, {
            opacity: BASE_DIM[pick],
            filter: "drop-shadow(0 0 0px rgba(210,165,70,0))",
            duration: 4 + Math.random() * 5,
            ease: "sine.inOut",
            onComplete: () => setTimeout(illuminate, 2000 + Math.random() * 6000),
          });
        },
      });
    };
    setTimeout(illuminate, 1500);

    return () => {
      els.forEach(w => { gsap.killTweensOf(w); w.remove(); });
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 select-none pointer-events-none"
      style={{ overflow: "hidden" }}
    />
  );
}

export default function BespokeCommissions() {
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingCategory, setPendingCategory] = useState(null);
  const sectionRef   = useRef(null);
  const gateLeftRef  = useRef(null);
  const gateRightRef = useRef(null);
  const stripAreaRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      setPendingCategory(e.detail || null);
      setModalOpen(true);
    };
    window.addEventListener("open-bespoke-category", handler);
    return () => window.removeEventListener("open-bespoke-category", handler);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".bespoke-label", {
        scrollTrigger: { trigger: ".bespoke-label", start: "top 90%", toggleActions: "play none none none" },
        y: 20, opacity: 0, duration: 0.7, ease: "power3.out",
      });

      const tl = gsap.timeline({
        delay: 0,
        scrollTrigger: {
          trigger: stripAreaRef.current,
          start: "top bottom",
          toggleActions: "play none none none",
        },
      });
      tl.to(gateLeftRef.current,  { x: "-100%", duration: 8, ease: "none" }, 0);
      tl.to(gateRightRef.current, { x: "100%",  duration: 8, ease: "none" }, 0);
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const leftDup = [...STRIP_IMAGES, ...STRIP_IMAGES];

  return (
    <>
      <section id="bespoke" ref={sectionRef} className="bg-onyx pt-0 pb-0 overflow-x-hidden">

        {/* Label row */}
        <div className="bespoke-label max-w-7xl mx-auto px-6 md:px-12 pt-10 pb-16 text-center">
          <span className="font-detail text-xs text-warm-gray uppercase tracking-[0.2em]">Commissions</span>
          <h2 className="font-syne font-bold text-2xl md:text-4xl lg:text-5xl text-cream/60 tracking-tight mt-1">
            Bespoke <span className="text-cream/35">&amp;</span> <span className="text-cream/60">Commissions</span>
          </h2>
        </div>

        {/* ── Desktop: diverging strips ──────────────────── */}
        <div className="hidden md:flex flex-col items-center">

          {/* Faint rule above strip */}
          <div className="w-full h-px bg-white/20 mb-10" />

          <div ref={stripAreaRef} className="relative flex items-stretch h-52 w-full gap-0">
            {/* Gate panels — slide outward from centre on scroll into view */}
            <div ref={gateLeftRef}  className="absolute inset-y-0 left-0 w-1/2 z-20 pointer-events-none" style={{ background: "#040404" }} />
            <div ref={gateRightRef} className="absolute inset-y-0 right-0 w-1/2 z-20 pointer-events-none" style={{ background: "#040404" }} />

            {/* Left — Screens portal */}
            <div className="flex-none self-center ml-8 mr-6 relative z-30">
              <ScreensPortal />
            </div>

            {/* Centre strip — scrolls left */}
            <div className="flex-1 overflow-hidden">
              <div className="marquee-track flex gap-3 h-full" style={{ width: "max-content", animationPlayState: "running" }}>
                {leftDup.map((src, i) => (
                  <div key={i} className="flex-none h-full aspect-square rounded-2xl overflow-hidden">
                    <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Bespoke portal */}
            <div className="flex-none self-center ml-6 mr-8 relative z-30">
              <BespokePortal />
            </div>
          </div>

          {/* Faint rule below strip */}
          <div className="w-full h-px bg-white/20 mt-10" />

          {/* Graphite zone below the hairline */}
          <div className="w-full bg-graphite" style={{ height: "112px" }} />
        </div>

        {/* ── Mobile: stacked strips + portal ──────────────────── */}
        <div className="md:hidden flex flex-col">

          {/* Portals */}
          <div className="flex justify-center gap-8 py-8">
            <ScreensPortal />
            <BespokePortal />
          </div>


          {/* Bottom strip */}
          <div className="h-28 overflow-hidden">
            <div className="marquee-track-right flex gap-2 h-full" style={{ width: "max-content", animationPlayState: "running" }}>
              {[...STRIP_IMAGES, ...STRIP_IMAGES].map((src, i) => (
                <div key={i} className="flex-none h-full aspect-square rounded-xl overflow-hidden">
                  <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          </div>

          {/* Graphite zone below strips on mobile */}
          <div className="w-full bg-graphite" style={{ height: "112px" }} />
        </div>

      </section>

      {modalOpen && <GalleryModal onClose={() => { setModalOpen(false); setPendingCategory(null); }} initialCategory={pendingCategory} />}
    </>
  );
}
