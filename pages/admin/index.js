import prisma from "../../lib/prisma";

import {
  Box,
  chakra,
  Flex,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
} from "@chakra-ui/react";

import { FiServer } from "react-icons/fi";
import NextLink from "next/link";
import { Link } from "@chakra-ui/react";

function lowermize(s) {
  return s[0].toLowerCase() + s.slice(1);
}

export async function getStaticProps() {
  const dmmf = { ...prisma._dmmf.datamodelEnumMap };


  

  const models = prisma._dmmf.modelMap;


  const keys = Object.keys(models);

  const data = await Promise.all(
    keys.map(async (item) => {
      const name = lowermize(item);
      console.log("name",name)

      const countQuery = await prisma[name].aggregate({
        _count: {
          id: true,
        },
      });

      return {
        href: `/admin/${name}`,
        name: name,
        counts: countQuery._count.id,
      };
    })
  );



  return {
    props: {
      data,
      dmmf,
    },
  };
}

function StatsCards({ data }) {
  const Stats =
    data &&
    data.map((item) => (
      <NextLink passHref href={item.href} key={item.name}>
        <Link>
          <Stat
            px={{ base: 2, md: 4 }}
            py={"5"}
            shadow={"xl"}
            border={"1px solid"}
            borderColor={"black"}
            rounded={"lg"}
          >
            <Flex justifyContent={"space-between"}>
              <Box pl={{ base: 2, md: 4 }}>
                <StatLabel fontWeight={"medium"} isTruncated>
                  {item.name}
                </StatLabel>
                <StatNumber fontSize={"2xl"} fontWeight={"medium"}>
                  {item.counts}
                </StatNumber>
              </Box>
              <Box
                my={"auto"}
                color={"black"}
                alignContent={"center"}
              >
                {<FiServer size={"3em"} />}
              </Box>
            </Flex>
          </Stat>
        </Link>
      </NextLink>
    ));

  return <>{Stats}</>;
}

export default function Admin({ data, dmmf }) {
  return (
    <Box maxW="7xl" mx={"auto"} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
      <chakra.h1
        textAlign={"center"}
        fontSize={"4xl"}
        py={10}
        fontWeight={"bold"}
      >
        Data Models
      </chakra.h1>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }}>
        <StatsCards data={data} />
      </SimpleGrid>
    </Box>
  );
}
