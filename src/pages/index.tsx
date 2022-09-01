import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';
interface ImgParams {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface ImageResponse {
  after: string;
  data: ImgParams[];
}

export default function Home(): JSX.Element {
  async function fetchImg({ pageParam = null }): Promise<ImageResponse> {
    const { data } = await api('/api/images', { params: { after: pageParam } });

    return data;

    console.log(data);
  }

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', fetchImg, {
    getNextPageParam: lastPage => lastPage?.after || null,
  });

  const formattedData = useMemo(() => {
    const formatted = data?.pages.flatMap(imageData => {
      return imageData.data.flat();
    });
    return formatted;
  }, [data]);

  if (isLoading && !isError) {
    return (
      <>
        <Loading />;
      </>
    );
  }

  if (isError && !isLoading) {
    return (
      <>
        <Error />
      </>
    );
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {hasNextPage && (
          <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
          </Button>
        )}
      </Box>
    </>
  );
}
