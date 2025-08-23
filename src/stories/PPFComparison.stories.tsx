import type { Meta, StoryObj } from '@storybook/react';
import PPFComparison from '../components/shared/PPFComparison';
import { ppfComparisonData } from '../data/ppfComparisonData';

const meta: Meta<typeof PPFComparison> = {
  title: 'Components/PPFComparison',
  component: PPFComparison,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Premium PPF comparison component with luxury styling, full accessibility, and responsive design. Supports English/Arabic locales with RTL layout.',
      },
    },
  },
  argTypes: {
    locale: {
      control: { type: 'select' },
      options: ['en', 'ar'],
      description: 'Language locale for content and layout direction',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for container styling',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default English version
export const Default: Story = {
  args: {
    locale: 'en',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default English version with luxury styling and SupaKoto brand highlighting.',
      },
    },
  },
};

// Arabic RTL version
export const Arabic: Story = {
  args: {
    locale: 'ar',
  },
  parameters: {
    docs: {
      description: {
        story: 'Arabic version with RTL layout and Arabic typography.',
      },
    },
  },
};

// Custom styling
export const CustomStyling: Story = {
  args: {
    locale: 'en',
    className: 'bg-gray-50 p-8',
  },
  parameters: {
    docs: {
      description: {
        story: 'Component with custom background and padding.',
      },
    },
  },
};

// Mobile viewport simulation
export const Mobile: Story = {
  args: {
    locale: 'en',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Mobile responsive view showing stacked card layout.',
      },
    },
  },
};

// Tablet viewport simulation
export const Tablet: Story = {
  args: {
    locale: 'en',
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'Tablet responsive view showing compact table layout.',
      },
    },
  },
};

// Arabic mobile
export const ArabicMobile: Story = {
  args: {
    locale: 'ar',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Arabic mobile view with RTL card layout.',
      },
    },
  },
};

// Custom data example
const customData = {
  ...ppfComparisonData,
  title: {
    en: "Custom PPF Analysis",
    ar: "تحليل مخصص لأفلام الحماية",
  },
  rows: ppfComparisonData.rows.slice(0, 4), // Show only first 4 rows
};

export const CustomData: Story = {
  args: {
    locale: 'en',
    data: customData,
  },
  parameters: {
    docs: {
      description: {
        story: 'Component with custom data showing reduced feature set.',
      },
    },
  },
};

// Accessibility testing
export const AccessibilityTest: Story = {
  args: {
    locale: 'en',
  },
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'keyboard-navigation',
            enabled: true,
          },
        ],
      },
    },
    docs: {
      description: {
        story: 'Story configured for accessibility testing with enhanced a11y checks.',
      },
    },
  },
};

// Performance testing with large dataset
const largeData = {
  ...ppfComparisonData,
  rows: [
    ...ppfComparisonData.rows,
    ...ppfComparisonData.rows.map((row, index) => ({
      ...row,
      feature: {
        en: `${row.feature.en} (Extended ${index + 1})`,
        ar: `${row.feature.ar} (موسع ${index + 1})`,
      },
    })),
  ],
};

export const LargeDataset: Story = {
  args: {
    locale: 'en',
    data: largeData,
  },
  parameters: {
    docs: {
      description: {
        story: 'Performance test with extended dataset to verify scrolling and rendering.',
      },
    },
  },
};
