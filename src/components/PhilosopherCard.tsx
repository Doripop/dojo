import React from "react";

import classNames from "classnames/bind";
import style from "../assets/styles/layout/arena.module.scss";

//철학자 카드 이미지
import confuciusImg from "../assets/image/confucius.svg";
import buddhaImg from "../assets/image/buddha.svg";
import zhuangzhouImg from "../assets/image/zhuangzhou.svg";
import platoImg from "../assets/image/plato.svg";
import aristotleImg from "../assets/image/aristotle.svg";
import descartesImg from "../assets/image/descartes.svg";
import lockeImg from "../assets/image/johnlocke.svg";
import kantImg from "../assets/image/immanuelkant.svg";
import nietzscheImg from "../assets/image/friedrichnietzsche.svg";
import hanfeiziImg from "../assets/image/hanfeizi.svg";

const cardData = [
  {
    name: "Confucius",
    name_kr: "공자",
    main_tag: "고대(Ancient)",
    sub_tag: "유가(Confucianism)",
    profileImg: confuciusImg,
    keywords: [
      "인(仁, Ren)",
      "예(禮, Li)",
      "군자(Junzi)",
      "효제(孝悌, Xiao)",
      "정명(Rectification of Names)",
      "중용(Zhongyong)"
    ],
    desc_kr:
      "도덕적 실천(仁), 사회 질서(禮), 인간 관계(孝悌) 등 규범적/집단적 윤리 및 정치 철학의 토대.",
    desc_en:
      "Moral practice, social order, human relations etc. The foundation of normative/collective ethics and political philosophy."
  },
  {
    name: "Buddha",
    name_kr: "부처",
    main_tag: "고대(Ancient)",
    sub_tag: "불교(Buddhism)",
    profileImg: buddhaImg,
    keywords: [
      "네 가지 성스러운 진리(Four Noble Truths)",
      "고(苦, Dukkha)",
      "팔정도(Eightfold Path)",
      "무아(無我, Anatta)",
      "연기(緣起)",
      "열반(Nirvana)"
    ],
    desc_kr:
      "고의 소멸, 연기론, 무아(無我)를 강조하며, 존재의 사유를 전개하고 인간 해탈과 존재론적 성찰을 더함.",
    desc_en:
      "The cessation of suffering, the doctrine of dependent origination, and non-self provide ontological and ethical contemplation, adding profound insight into human existence and liberation."
  },
  {
    name: "Zhuang Zhou",
    name_kr: "장자",
    main_tag: "고대(Ancient)",
    sub_tag: "도가(Taoism)",
    profileImg: zhuangzhouImg,
    keywords: [
      "도(道, Tao)",
      "만물제동(Equality of Things)",
      "좌망(Sitting and Forgetting)",
      "절대 자유(Absolute Freedom)",
      "소요유(逍遙遊, Wandering)"
    ],
    desc_kr:
      "자연과 합일, 탈규범적 자유 등 초월적/개인적 실존 및 인식론적 관점을 제시하여 유가와 대립적 대화를 이룸.",
    desc_en:
      "It presents transcendental/individualistic existential and epistemological perspectives such as unity with nature, freedom beyond norms, thereby forming a dialectical opposition with Confucianism."
  },
  {
    name: "Plato",
    name_kr: "플라톤",
    main_tag: "고대(Ancient)",
    sub_tag: "형이상학(Metaphysics)",
    profileImg: platoImg,
    keywords: [
      "이데아(Theory of Forms)",
      "상기(Anamnesis)",
      "정의(Justice)",
      "철인왕(Philosopher King)",
      "동굴의 비유(Allegory of the Cave)"
    ],
    desc_kr:
      "고대 철학의 정점. 이데아론(Theory of Forms)을 통한 형이상학적 질서 구축.",
    desc_en:
      "The pinnacle of ancient philosophy. Establishing a metaphysical foundation through the Theory of Forms."
  },
  {
    name: "Aristotle",
    name_kr: "아리스토텔레스",
    main_tag: "고대(Ancient)",
    sub_tag: "형이상학(Metaphysics)",
    profileImg: aristotleImg,
    keywords: [
      "형상과 질료(Form and Matter)",
      "잠재력(Potentiality)",
      "현실태(Actuality)",
      "행복(Eudaimonia)",
      "중용(The Golden Mean)",
      "정치적 동물(Zoon Politikon)"
    ],
    desc_kr:
      "고대 철학의 완성 및 분화. 플라톤의 사상을 비판적으로 수용하며 경험적/체계적 학문의 토대 마련.",
    desc_en:
      "The completion and differentiation of ancient philosophy. Critically incorporating Plato’s ideas, laying the foundation for empirical and systematic scholarship."
  },
  {
    name: "John Locke",
    name_kr: "존 로크",
    main_tag: "근대(Modern)",
    sub_tag: "경험론(Empiricism)",
    profileImg: lockeImg,
    keywords: [
      "백지설(Tabula Rasa)",
      "경험(Experience)",
      "감각과 반성(Sensation and Reflection)",
      "관념 거부(Rejection of innate ideas)"
    ],
    desc_kr:
      "근대 경험론의 기초. 인간의 마음이 경험 이전에는 아무것도 없는 백지이며, 모든 지식은 감각과 반성을 통해 획득된다고 주장.",
    desc_en:
      "The foundations of Modern Empiricism. Human mind is a blank slate at birth, and knowledge and ideas are formed solely through sensory experience."
  },
  {
    name: "René Descartes",
    name_kr: "르네 데카르트",
    main_tag: "근대(Modern)",
    sub_tag: "합리론(Rationalism)",
    profileImg: descartesImg,
    keywords: [
      "타고난 관념(Innate ideas)",
      "방법적 회의(Methodological Doubt)",
      "정신-신체 이원론(Mind-Body Dualism)",
      "코기토(Cogito)",
      "명석 판명한 인식(Clear and Distinct Perception)"
    ],
    desc_kr:
      "근대 철학의 기초 확립. 방법적 회의를 통해 코기토(Cogito)를 정립하고, 주체-대상 이원론과 과학적 사고의 기반을 마련.",
    desc_en:
      "The foundation of modern rationalism. The first step in the Cogito which started a subject-centered epistemology through methodological doubt and the Cogito."
  },
  {
    name: "Immanuel Kant",
    name_kr: "임마누엘 칸트",
    main_tag: "근대(Modern)",
    sub_tag: "선험적 관념론(Idealism)",
    profileImg: kantImg,
    keywords: [
      "정언 명령(Categorical Imperative)",
      "의무(Duty)",
      "현상(Phenomenon)",
      "물자체(Noumenon)",
      "선의지(Good Will)"
    ],
    desc_kr:
      "합리론과 경험론의 종합. 인간 인식의 한계를 규명하고 선험적 관념론을 정립하여 근대 철학의 정점을 이룸.",
    desc_en:
      "The synthesis of rationalism and empiricism. By clarifying the limits and conditions of human cognition through transcendental idealism, it reached the pinnacle of modern philosophy."
  },
  {
    name: "Friedrich Nietzsche",
    name_kr: "프리드리히 니체",
    main_tag: "현대(Contemporary)",
    sub_tag: "실존주의(Existentialism)",
    profileImg: nietzscheImg,
    keywords: [
      "권력의지(Will to Power)",
      "영원회귀(Eternal Recurrence)",
      "디오니소스(Dionysian)",
      "아폴론적(Apollonian)",
      "가치 전도(Transvaluation of All Values)"
    ],
    desc_kr:
      "현대 철학의 전환점. 기존 가치와 도덕에 대한 급진적 재해석을 통해 새로운 사유의 지평을 연 철학자.",
    desc_en:
      "Modern philosophy’s transition and critique of traditional values. With Nietzsche’s metaphysical tradition, paving the way for value inversion and existential thought."
  },
  {
    name: "Han Fei Zi",
    name_kr: "한비자",
    main_tag: "고대(Ancient)",
    sub_tag: "법가(Legalism)",
    profileImg: hanfeiziImg,
    keywords: [
      "법(Law)",
      "술(Method/Technique)",
      "세(Power/Authority)",
      "이기(Self-interest)",
      "현실적 통치론(Theory of Innate Evil)"
    ],
    desc_kr:
      "법과 술, 세를 중심으로 한 강력한 국가 통치론. 개인의 본성은 이기적이며, 강한 법과 권력이 질서를 만든다고 주장.",
    desc_en:
      "Completed doctrine of Legalism. Philosophy of rule by law through strict order, laws, power techniques, and absolute authority."
  }
];
const cn = classNames.bind(style);

const PhilosopherCard = ({ name, type }: any) => {
  const philosopher = cardData.find(
    (philosopher) =>
      philosopher.name.toLowerCase().replace(/\s+/g, "") ===
      name.toLowerCase().replace(/\s+/g, "")
  );
  console.log("philosopher", philosopher);
  return (
    <div className={cn("philosopher-card", `${type}`)}>
      <div className={cn("philosopher-card-image")}>
        <img src={philosopher?.profileImg} alt={philosopher?.name_kr} />
      </div>
      <div className={cn("philosopher-card-info")}>
        <div className={cn("philosopher-card-names")}>
          <h3>{philosopher?.name_kr}</h3>
          <p>{philosopher?.name}</p>
        </div>
        <div className={cn("philosopher-card-tags")}>
          <span className={cn("main-tag")}>{philosopher?.main_tag}</span>
          <span className={cn("sub-tag")}>{philosopher?.sub_tag}</span>
        </div>
        <div className={cn("philosopher-card-desc-tag")}>
          {philosopher?.keywords.map((keyword, index) => (
            <span key={`keyword-${index}`} className={cn("keyword-tag")}>
              {keyword}
            </span>
          ))}
        </div>
        <div className={cn("philosopher-card-desc")}>
          {philosopher?.desc_kr}
        </div>
        <div className={cn("philosopher-card-desc-en")}>
          {philosopher?.desc_en}
        </div>
      </div>
    </div>
  );
};

export default PhilosopherCard;
