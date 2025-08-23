import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PPFComparison from '../PPFComparison';
import { ppfComparisonData } from '../../../data/ppfComparisonData';

// Mock data for testing
const mockData = {
  title: {
    en: "Test PPF Comparison",
    ar: "اختبار مقارنة الأفلام",
  },
  columns: [
    { key: "feature", en: "Feature", ar: "الميزة" },
    { key: "supa", en: "SupaKoto", ar: "سوبا كوتو" },
    { key: "xpel3m", en: "XPEL/3M", ar: "XPEL/3M" },
    { key: "china", en: "Chinese PPF", ar: "أفلام صينية" },
  ],
  rows: [
    {
      feature: { en: "Test Feature", ar: "ميزة اختبار" },
      supa: { en: "SupaKoto-backed 15 years", ar: "ضمان ١٥ سنة من سوبا كوتو" },
      xpel3m: { en: "Good quality ⚠ Market has many cheap knock-offs.", ar: "جودة جيدة ⚠ السوق مليء بالتقليد" },
      china: { en: "Low quality", ar: "جودة منخفضة" },
    },
  ],
};

describe('PPFComparison', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<PPFComparison />);
      expect(screen.getByText('Premium PPF Comparison')).toBeInTheDocument();
    });

    it('renders with English locale', () => {
      render(<PPFComparison locale="en" />);
      expect(screen.getByText('Premium PPF Comparison')).toBeInTheDocument();
      expect(screen.getByText('Feature')).toBeInTheDocument();
    });

    it('renders with Arabic locale', () => {
      render(<PPFComparison locale="ar" />);
      expect(screen.getByText('مقارنة أفلام حماية الطلاء الممتازة')).toBeInTheDocument();
      expect(screen.getByText('الميزة')).toBeInTheDocument();
    });

    it('renders with custom data', () => {
      render(<PPFComparison data={mockData} />);
      expect(screen.getByText('Test PPF Comparison')).toBeInTheDocument();
      expect(screen.getByText('Test Feature')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(<PPFComparison className="custom-class" />);
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('Accessibility', () => {
    it('has proper table structure for desktop', () => {
      render(<PPFComparison />);
      
      // Check for table elements (hidden on mobile by default)
      const table = document.querySelector('table');
      expect(table).toBeInTheDocument();
      
      // Check for caption (screen reader only)
      const caption = screen.getByText('Premium PPF Comparison', { selector: 'caption' });
      expect(caption).toHaveClass('sr-only');
      
      // Check for proper table headers
      expect(screen.getByRole('columnheader', { name: /feature/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /supakoto/i })).toBeInTheDocument();
    });

    it('has proper heading structure', () => {
      render(<PPFComparison />);
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('Premium PPF Comparison');
    });

    it('supports keyboard navigation for tooltips', () => {
      render(<PPFComparison data={mockData} />);
      
      // Find elements with tooltips (badges)
      const badges = screen.getAllByRole('button');
      expect(badges.length).toBeGreaterThan(0);
      
      // Test keyboard focus
      const firstBadge = badges[0];
      fireEvent.focus(firstBadge);
      expect(firstBadge).toHaveFocus();
    });
  });

  describe('Responsive Behavior', () => {
    it('shows table on larger screens', () => {
      render(<PPFComparison />);
      const tableContainer = document.querySelector('.hidden.sm\\:block');
      expect(tableContainer).toBeInTheDocument();
    });

    it('shows mobile cards on smaller screens', () => {
      render(<PPFComparison />);
      const mobileContainer = document.querySelector('.sm\\:hidden');
      expect(mobileContainer).toBeInTheDocument();
    });
  });

  describe('RTL Support', () => {
    it('sets RTL direction for Arabic locale', () => {
      const { container } = render(<PPFComparison locale="ar" />);
      expect(container.firstChild).toHaveAttribute('dir', 'rtl');
    });

    it('sets LTR direction for English locale', () => {
      const { container } = render(<PPFComparison locale="en" />);
      expect(container.firstChild).toHaveAttribute('dir', 'ltr');
    });

    it('applies Arabic font classes for Arabic locale', () => {
      render(<PPFComparison locale="ar" />);
      const title = screen.getByRole('heading', { level: 2 });
      expect(title).toHaveClass('font-arabic');
    });

    it('applies brand font classes for English locale', () => {
      render(<PPFComparison locale="en" />);
      const title = screen.getByRole('heading', { level: 2 });
      expect(title).toHaveClass('font-brand');
    });
  });

  describe('Interactive Elements', () => {
    it('shows tooltips on hover', async () => {
      render(<PPFComparison data={mockData} />);
      
      // Find a badge with tooltip
      const badges = screen.getAllByRole('button');
      if (badges.length > 0) {
        fireEvent.mouseEnter(badges[0]);
        
        // Tooltip should appear
        const tooltip = document.querySelector('[role="tooltip"]');
        expect(tooltip).toBeInTheDocument();
        
        fireEvent.mouseLeave(badges[0]);
      }
    });

    it('handles badge interactions', () => {
      render(<PPFComparison data={mockData} />);
      
      // Check for warranty badge
      const warrantyBadge = screen.getByText('15Y Warranty');
      expect(warrantyBadge).toBeInTheDocument();
      
      // Check for warning badge
      const warningBadge = screen.getByText('Beware of fakes');
      expect(warningBadge).toBeInTheDocument();
    });
  });

  describe('Content Enhancement', () => {
    it('adds warranty badge for SupaKoto content', () => {
      render(<PPFComparison data={mockData} />);
      expect(screen.getByText('15Y Warranty')).toBeInTheDocument();
    });

    it('adds warning badge for XPEL/3M content with warnings', () => {
      render(<PPFComparison data={mockData} />);
      expect(screen.getByText('Beware of fakes')).toBeInTheDocument();
    });

    it('highlights SupaKoto column', () => {
      render(<PPFComparison />);
      expect(screen.getByText('Recommended')).toBeInTheDocument();
    });
  });

  describe('Data Handling', () => {
    it('handles missing data gracefully', () => {
      const incompleteData = {
        ...mockData,
        rows: [],
      };
      
      render(<PPFComparison data={incompleteData} />);
      expect(screen.getByText('Test PPF Comparison')).toBeInTheDocument();
    });

    it('uses default data when none provided', () => {
      render(<PPFComparison />);
      expect(screen.getByText('Premium PPF Comparison')).toBeInTheDocument();
      expect(screen.getByText('Origin & Manufacturing')).toBeInTheDocument();
    });
  });
});
