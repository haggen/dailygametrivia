import { Flex } from "~/src/components/Flex";
import { Icon } from "~/src/components/Icon";

type Props = {
  current: number;
  max: number;
};

export function Lives({ current, max }: Props) {
  return (
    <Flex gap=".25rem" style={{ fontSize: "1.5rem" }}>
      {Array(max)
        .fill(null)
        .map((_, index) =>
          current > index ? (
            <Icon key={index} name="redHeart" />
          ) : (
            <Icon key={index} name="grayHeart" />
          )
        )}
    </Flex>
  );
}
