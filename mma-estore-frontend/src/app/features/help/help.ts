import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface FAQ {
  question: string;
  answer: string;
  category: string;
  isOpen?: boolean;
}

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './help.html',
  styleUrl: './help.css',
})
export class Help {
  searchQuery = '';
  selectedCategory = 'all';

  categories = [
    { id: 'all', label: 'All Topics', icon: 'bi-grid' },
    { id: 'orders', label: 'Orders & Tracking', icon: 'bi-box-seam' },
    { id: 'shipping', label: 'Shipping & Rates', icon: 'bi-truck' },
    { id: 'returns', label: 'Returns & Refunds', icon: 'bi-arrow-counterclockwise' },
    { id: 'sizing', label: 'Sizing & Gear Specs', icon: 'bi-rulers' },
    { id: 'payment', label: 'Payment & Gift Cards', icon: 'bi-credit-card' },
  ];

  faqs: FAQ[] = [
    {
      category: 'orders',
      question: 'How do I track my MMA E-Store order?',
      answer: 'You can easily track your order by clicking "Find Your Order" in the top bar or heading to your Account Profile. Enter your Order ID and Billing Email to get real-time tracking updates.',
      isOpen: true,
    },
    {
      category: 'orders',
      question: 'Can I change or cancel my order after placing it?',
      answer: 'Orders are processed quickly to ensure fast dispatch. If you need to modify or cancel your order, please contact Customer Support within 1 hour of placing the order.',
    },
    {
      category: 'shipping',
      question: 'What are the shipping methods and delivery times?',
      answer: 'We offer Express (1-2 business days) and Standard Shipping (3-5 business days). International orders typically arrive within 7-12 business days.',
    },
    {
      category: 'shipping',
      question: 'Do you ship UFC replica belts and heavy equipment internationally?',
      answer: 'Yes! We ship all official UFC merchandise, apparel, gloves, and replica belts worldwide with custom protective packaging.',
    },
    {
      category: 'returns',
      question: 'What is your return policy?',
      answer: 'We accept returns within 30 days of receipt for unworn apparel, sealed collectibles, and unused equipment in original packaging.',
    },
    {
      category: 'returns',
      question: 'How long does a refund take to process?',
      answer: 'Once our warehouse inspects the returned item, refunds are processed back to your original payment method within 3-5 business days.',
    },
    {
      category: 'sizing',
      question: 'How do I pick the right size for UFC fight gloves and fight shorts?',
      answer: 'Consult our official UFC Size Guide on product pages. Fight shorts feature stretch waistbands, and fight gloves range from S/M (10-12oz) to L/XL (14-16oz).',
    },
    {
      category: 'payment',
      question: 'What payment methods do you accept?',
      answer: 'We accept Visa, MasterCard, American Express, PayPal, Apple Pay, Google Pay, and official MMA E-Store Gift Cards.',
    }
  ];

  get filteredFaqs(): FAQ[] {
    return this.faqs.filter(faq => {
      const matchesCat = this.selectedCategory === 'all' || faq.category === this.selectedCategory;
      const matchesSearch = !this.searchQuery || 
        faq.question.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
        faq.answer.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }

  toggleFaq(faq: FAQ): void {
    faq.isOpen = !faq.isOpen;
  }
}
