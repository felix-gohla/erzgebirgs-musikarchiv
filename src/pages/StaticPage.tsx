import { Box, Typography, useTheme } from '@mui/material';
import React from 'react';
import { useParams } from 'react-router-dom';

import { DirectusImage, Loader, MainLayout } from '@/components';
import { useGetStaticPageById } from '@/hooks/staticPages';
import {
  type DelimiterBlock as IDelimiterBlock,
  type HeadingBlock as IHeadingBlock,
  type ImageBlock as IImageBlock,
  type NestedListBlock as INestedListBlock,
  type ParagraphBlock as IParagraphBlock,
  type RawHtmlBlock as IRawHtmlBlock,
} from '@/types';
import { DOMPurify } from '@/utils';

export const StaticPagePage: React.FC = () => {
  const { id: staticPageId } = useParams();

  const parsedStaticPageId = parseInt(staticPageId || '1');

  const theme = useTheme();

  const { data: staticPage, isLoading: isLoadingPage } = useGetStaticPageById(parsedStaticPageId, !!staticPageId);

  const isLoading = isLoadingPage;

  if (!staticPageId) {
    return (
      <MainLayout>
        <Typography variant="h1">Seite nicht gefunden.</Typography>
      </MainLayout>
    );
  }

  if (isLoading) {
    return (
      <MainLayout>
        <Loader text="Lade Seite..." />
      </MainLayout>
    );
  }

  if (!staticPage) {
    return (
      <MainLayout>
        <Typography variant="h1" sx={{ color: theme.palette.error.main }}>Seite konnte nicht geladen werden.</Typography>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Typography variant='h1' sx={{ mb: theme.spacing(2) }}>
        { staticPage.title }
      </Typography>

      <Box>
        {
          staticPage.content.blocks.map((block) => {
            switch (block.type) {
            case 'paragraph':
              return <ParagraphBlock key={block.id} block={block} />;
            case 'header':
              return <HeaderBlock key={block.id} block={block} />;
            case 'nestedlist':
              return <ListBlock key={block.id} block={block} />;
            case 'image':
              return <ImageBlock key={block.id} block={block} />;
            case 'raw':
              return <RawHtmlBlock key={block.id} block={block} />;
            case 'delimiter':
              return <DividerBlock key={block.id} block={block} />;
            default:
              return null;
            }
          })
        }
      </Box>
    </MainLayout>
  );
};

const ParagraphBlock: React.FC<{ block: IParagraphBlock }> = ({ block }) => {
  return <Typography component={'p'} dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(block.data.text, {}) }} mb={(theme) => theme.spacing(1)} />;
};

const HeaderBlock: React.FC<{ block: IHeadingBlock }> = ({ block }) => {
  const variants = {
    1: 'h1',
    2: 'h2',
    3: 'h3',
    4: 'h4',
    5: 'h5',
    6: 'h6',
  } as const;
  const variant = variants[block.data.level] ?? 'h6';
  return <Typography
    variant={variant}
    mt={(theme) => theme.spacing(2)}
    mb={(theme) => theme.spacing(1)}
  >
    {block.data.text}
  </Typography>;
};

const OrderedList: React.FC<{ items: INestedListBlock['data']['items'] }> = ({ items }) =>
  <ol>
    { items.map((item, idx) => <li key={idx}>{item.content}{ item.items.length > 0 ? <OrderedList items={item.items} /> : null }</li>) }
  </ol>;

const UnorderedList: React.FC<{ items: INestedListBlock['data']['items'] }> = ({ items }) =>
  <ul>
    { items.map((item, idx) => <li key={idx}>{item.content}{ item.items.length > 0 ? <OrderedList items={item.items} /> : null }</li>) }
  </ul>;

const ListBlock: React.FC<{ block: INestedListBlock }> = ({ block }) => {
  switch (block.data.style) {
  case 'ordered':
    return <OrderedList items={block.data.items} />;
  case 'unordered':
    return <UnorderedList items={block.data.items} />;
  default:
    return null;
  }
};

const ImageBlock: React.FC<{block: IImageBlock}> = ({ block }) => (
  <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center' sx={(theme) => ({ my: theme.spacing(2) })}>
    <Box mb={(theme) => theme.spacing(0.5)}>
      <DirectusImage
        fileId={block.data.file.fileId}
        thumbnail={{ height: 512, quality: 100 }}
        alt={block.data.caption || undefined}
      />
    </Box>
    { block.data.caption && <Typography variant='subtitle2'>{block.data.caption}</Typography> }
  </Box>
);

const DividerBlock: React.FC<{block: IDelimiterBlock}> = () => (
  <Box whiteSpace={(theme) => ({ my: theme.spacing(2) })}>
    <hr />
  </Box>
);

const RawHtmlBlock: React.FC<{block: IRawHtmlBlock}> = ({ block }) => <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(block.data.html) }}></div>;
