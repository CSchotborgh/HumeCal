import { type User, type InsertUser, type Event, type InsertEvent, type PricingOption } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getEvents(): Promise<Event[]>;
  getEvent(id: string): Promise<Event | undefined>;
  getEventsByDateRange(startDate: string, endDate: string): Promise<Event[]>;
  getEventsByType(eventType: string): Promise<Event[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private events: Map<string, Event>;

  constructor() {
    this.users = new Map();
    this.events = new Map();
    this.seedEvents();
  }

  private seedEvents() {
    // Real Hume Lake events for 2025-2026 based on the registration data
    const eventsData: InsertEvent[] = [
      {
        title: "Father/Son Adventure Camp",
        startDate: "2025-08-21",
        endDate: "2025-08-23",
        eventType: "Family Event",
        description: "An adventure-packed camp experience for fathers and sons with outdoor activities, team building, and faith-based programming.",
        ageGroup: "8+",
        gender: "Male",
        pricingOptions: [
          { name: "Event Only Adult", price: 329, description: "Ages 18 and older" },
          { name: "Single Family Housing with bathroom Adult", price: 374, description: "Ages 18 and older" },
          { name: "Single Family Housing without bathroom Adult", price: 359, description: "Ages 18 and older" },
          { name: "Shared Family Housing Adult", price: 344, description: "Ages 18 and older" },
          { name: "RV Housing Adult", price: 329, description: "Ages 18 and older" },
          { name: "Event Only Child", price: 329, description: "Ages 8 to 17" },
          { name: "Single Family Housing with bathroom Child", price: 374, description: "Ages 8 to 17" },
          { name: "Single Family Housing without bathroom Child", price: 359, description: "Ages 8 to 17" },
          { name: "Shared Family Housing Child", price: 344, description: "Ages 8 to 17" },
          { name: "RV Housing Child", price: 329, description: "Ages 8 to 17" }
        ]
      },
      {
        title: "Rest and Renew - Pastors Retreat",
        startDate: "2025-09-08",
        endDate: "2025-09-10",
        eventType: "Pastor Retreat",
        description: "A time of spiritual renewal and rest specifically designed for pastors and ministry leaders.",
        ageGroup: "18+",
        gender: "Coed",
        pricingOptions: [
          { name: "Rest & Renew Retreat", price: 269, description: "Ages 18 and older" },
          { name: "Rest & Renew Retreat Event Only", price: 249, description: "Ages 18 and older" }
        ]
      },
      {
        title: "Fall Women's Retreat 1",
        startDate: "2025-09-19",
        endDate: "2025-09-21",
        eventType: "Women's Retreat",
        description: "A transformative weekend retreat focused on rest, renewal, and spiritual growth for women.",
        ageGroup: "18+",
        gender: "Female",
        pricingOptions: [
          { name: "Event Only (No Housing)", price: 344, description: "Ages 18 and older" },
          { name: "Economy Housing", price: 374, description: "Ages 18 and older" },
          { name: "Standard Housing", price: 414, description: "Ages 18 and older" },
          { name: "Deluxe Housing", price: 444, description: "Ages 18 and older" }
        ]
      },
      {
        title: "Fall Women's Retreat 2",
        startDate: "2025-09-26",
        endDate: "2025-09-28",
        eventType: "Women's Retreat",
        description: "A transformative weekend retreat focused on rest, renewal, and spiritual growth for women.",
        ageGroup: "18+",
        gender: "Female",
        pricingOptions: [
          { name: "Event Only (No Housing)", price: 344, description: "Ages 18 and older" },
          { name: "Economy Housing", price: 374, description: "Ages 18 and older" },
          { name: "Standard Housing", price: 414, description: "Ages 18 and older" },
          { name: "Deluxe Housing", price: 444, description: "Ages 18 and older" }
        ]
      },
      {
        title: "Fall Marriage Retreat",
        startDate: "2025-10-03",
        endDate: "2025-10-05",
        eventType: "Marriage Retreat",
        description: "Strengthen your marriage with biblical teaching, fun activities, and quality time together in a beautiful mountain setting.",
        ageGroup: "18+",
        gender: "Coed",
        pricingOptions: [
          { name: "Event Only", price: 459.50, description: "Ages 18 and older" },
          { name: "Economy Housing", price: 489.50, description: "Ages 18 and older" },
          { name: "Standard Housing", price: 529.50, description: "Ages 18 and older" },
          { name: "Deluxe Housing", price: 559.50, description: "Ages 18 and older" },
          { name: "RV Space", price: 469.50, description: "Ages 18 and older" }
        ]
      },
      {
        title: "Men's Retreat",
        startDate: "2025-10-09",
        endDate: "2025-10-11",
        eventType: "Men's Retreat",
        description: "A powerful weekend designed to challenge and encourage men in their faith journey.",
        ageGroup: "18+",
        gender: "Male",
        pricingOptions: [
          { name: "Event Only Adult", price: 394, description: "Ages 18 and older" },
          { name: "Economy Housing Adult", price: 424, description: "Ages 18 and older" },
          { name: "Standard Adult", price: 464, description: "Ages 18 and older" },
          { name: "Deluxe Housing Adult", price: 494, description: "Ages 18 and older" },
          { name: "RV Site Adult", price: 414, description: "Ages 18 and older" }
        ]
      },
      {
        title: "Creative Arts Conference",
        startDate: "2025-10-16",
        endDate: "2025-10-18",
        eventType: "Creative Arts",
        description: "Explore and develop your creative gifts through workshops, performances, and inspiration.",
        ageGroup: "18+",
        gender: "Coed",
        pricingOptions: [
          { name: "Adult Event Only", price: 384, description: "Ages 18 and older" },
          { name: "Adult Economy Housing", price: 414, description: "Ages 18 and older" },
          { name: "Adult Standard Housing", price: 454, description: "Ages 18 and older" },
          { name: "Adult Deluxe Housing", price: 484, description: "Ages 18 and older" },
          { name: "Adult RV Site", price: 404, description: "Ages 18 and older" }
        ]
      },
      {
        title: "Youth Leaders Retreat",
        startDate: "2025-11-06",
        endDate: "2025-11-08",
        eventType: "Youth Leaders",
        description: "Equipping and encouraging those who work with youth in ministry settings.",
        ageGroup: "18+",
        gender: "Coed",
        pricingOptions: [
          { name: "Youth Leaders Retreat Adult", price: 209, description: "Ages 18 and older" }
        ]
      },
      {
        title: "Young Adults Fall Retreat",
        startDate: "2025-11-07",
        endDate: "2025-11-09",
        eventType: "Young Adults",
        description: "A retreat designed specifically for young adults to grow in faith and community.",
        ageGroup: "16-75",
        gender: "Coed",
        pricingOptions: [
          { name: "Young Adults Adult", price: 350, description: "Ages 18 to 75" },
          { name: "Young Adults Minor", price: 350, description: "Ages 16 to 17" }
        ]
      },
      {
        title: "Father/Daughter Retreat",
        startDate: "2025-11-14",
        endDate: "2025-11-16",
        eventType: "Family Event",
        description: "A special retreat for fathers and daughters to strengthen their relationship and create lasting memories.",
        ageGroup: "8+",
        gender: "Coed",
        pricingOptions: [
          { name: "Event Only Adult", price: 365, description: "Ages 18 and older" },
          { name: "Economy Housing Adult", price: 395, description: "Ages 18 and older" },
          { name: "Standard Housing Adult", price: 435, description: "Ages 18 and older" },
          { name: "Deluxe Housing Adult", price: 465, description: "Ages 18 and older" },
          { name: "RV Site Adult", price: 385, description: "Ages 18 and older" },
          { name: "Event Only Child", price: 365, description: "Ages 8 to 17" },
          { name: "Economy Housing Child", price: 395, description: "Ages 8 to 17" },
          { name: "Standard Housing Child", price: 435, description: "Ages 8 to 17" },
          { name: "Deluxe Housing Child", price: 465, description: "Ages 8 to 17" },
          { name: "RV Site Child", price: 385, description: "Ages 8 to 17" }
        ]
      },
      {
        title: "Young Adults Winter Retreat",
        startDate: "2026-03-06",
        endDate: "2026-03-08",
        eventType: "Young Adults",
        description: "A winter retreat for young adults featuring skiing, snowboarding, and spiritual growth.",
        ageGroup: "16-75",
        gender: "Coed",
        pricingOptions: [
          { name: "Young Adults - Winter", price: 225, description: "Ages 18 to 75" },
          { name: "Young Adults Minor - Winter", price: 225, description: "Ages 16 to 17" },
          { name: "Young Adults Adult", price: 395, description: "Ages 18 to 75" },
          { name: "Young Adults Minor", price: 395, description: "Ages 16 to 17" }
        ]
      },
      {
        title: "Spring Women's Retreat 1",
        startDate: "2026-04-17",
        endDate: "2026-04-19",
        eventType: "Women's Retreat",
        description: "Spring renewal retreat for women featuring inspiring speakers Megan Marshman and Paige Payne.",
        ageGroup: "18+",
        gender: "Female",
        pricingOptions: [
          { name: "Event Only", price: 349, description: "Ages 18 and older" },
          { name: "Economy Housing", price: 389, description: "Ages 18 and older" },
          { name: "Standard Housing", price: 419, description: "Ages 18 and older" },
          { name: "Deluxe Housing", price: 479, description: "Ages 18 and older" }
        ]
      },
      {
        title: "Spring Women's Retreat 2",
        startDate: "2026-04-24",
        endDate: "2026-04-26",
        eventType: "Women's Retreat",
        description: "Spring renewal retreat for women featuring inspiring speakers and worship.",
        ageGroup: "18+",
        gender: "Female",
        pricingOptions: [
          { name: "Event Only", price: 349, description: "Ages 18 and older" },
          { name: "Economy Housing", price: 389, description: "Ages 18 and older" },
          { name: "Standard Housing", price: 419, description: "Ages 18 and older" },
          { name: "Deluxe Housing", price: 479, description: "Ages 18 and older" }
        ]
      }
    ];

    eventsData.forEach(eventData => {
      const id = randomUUID();
      const event: Event = { ...eventData, id };
      this.events.set(id, event);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getEvents(): Promise<Event[]> {
    return Array.from(this.events.values()).sort((a, b) => 
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
  }

  async getEvent(id: string): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async getEventsByDateRange(startDate: string, endDate: string): Promise<Event[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return Array.from(this.events.values()).filter(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      return (eventStart >= start && eventStart <= end) || 
             (eventEnd >= start && eventEnd <= end) ||
             (eventStart <= start && eventEnd >= end);
    }).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  }

  async getEventsByType(eventType: string): Promise<Event[]> {
    return Array.from(this.events.values())
      .filter(event => event.eventType === eventType)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  }
}

export const storage = new MemStorage();
