export default function LegacyRegistration() {
  return null;
}
export function getServerSideProps() {
  return {
    redirect: { destination: "/stocks/create/step-one", permanent: false },
  };
}
