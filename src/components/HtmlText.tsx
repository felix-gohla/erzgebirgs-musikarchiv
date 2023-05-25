import { Typography, useTheme } from '@mui/material';
import React, { CSSProperties } from 'react';

import { DOMPurify } from '@/utils';

interface HtmlTextProps {
    html: string,
}

export const HtmlText: React.FC<HtmlTextProps> = (props) => {
  const { html } = props;

  const theme = useTheme();

  const tags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;

  const nestedRules: Partial<Record<`& ${typeof tags[number]}`, CSSProperties>>= {};
  tags.forEach((tag) => {
    nestedRules[`& ${tag}`] = { ...theme.typography[tag] };
  });
  return (
    <Typography
      sx={{
        ...nestedRules,
        hyphens: 'auto',
        fontSize: theme.typography.body1,
      }}
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
    />
  );
};

