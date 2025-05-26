import type { RootStore } from "@/app/providers/StoreProvider/RootStore";
import { QueryClient } from "@tanstack/react-query";
import { makeAutoObservable, runInAction } from "mobx";
import {
  DEFAULT_THEORY_FILTERS,
  DueCard,
  GeneralStats,
  ReviewResponse,
  TheoryCard,
  TheoryCategory,
  TheoryFiltersState,
} from "./types";

export class TheoryStore {
  // Состояние карточек
  cards: TheoryCard[] = [];
  currentCard: TheoryCard | null = null;
  categories: TheoryCategory[] = [];
  isLoading: boolean = false;
  error: string | null = null;

  // Состояние фильтров
  filters: TheoryFiltersState = { ...DEFAULT_THEORY_FILTERS };

  // Состояние UI
  flippedCards: Set<string> = new Set();
  currentPage: number = 1;
  totalPages: number = 0;
  totalItems: number = 0;

  // Новые поля для интервального повторения
  studyMode: "classic" | "spaced" = "classic";
  dueCards: DueCard[] = [];
  currentDueCard: DueCard | null = null;
  generalStats: GeneralStats | null = null;
  isReviewMode: boolean = false;

  // @ts-expect-error - Используется в конструкторе, но не в других методах
  private _rootStore: RootStore;
  // @ts-expect-error - Используется в конструкторе, но не в других методах
  private _queryClient: QueryClient;

  constructor(rootStore: RootStore, queryClient: QueryClient) {
    this._rootStore = rootStore;
    this._queryClient = queryClient;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  // Методы для работы с карточками
  setCards(cards: TheoryCard[]) {
    this.cards = cards;
  }

  setCurrentCard(card: TheoryCard | null) {
    this.currentCard = card;
  }

  setCategories(categories: TheoryCategory[]) {
    this.categories = categories;
  }

  setLoading(loading: boolean) {
    this.isLoading = loading;
  }

  setError(error: string | null) {
    this.error = error;
  }

  // Методы для работы с фильтрами
  updateFilters(newFilters: Partial<TheoryFiltersState>) {
    this.filters = { ...this.filters, ...newFilters };
    // При изменении фильтров сбрасываем на первую страницу
    if (
      newFilters.searchText !== undefined ||
      newFilters.category !== undefined ||
      newFilters.subCategory !== undefined
    ) {
      this.currentPage = 1;
    }
  }

  resetFilters() {
    this.filters = { ...DEFAULT_THEORY_FILTERS };
    this.currentPage = 1;
  }

  // Методы для работы с UI состоянием
  toggleCardFlip(cardId: string) {
    if (this.flippedCards.has(cardId)) {
      this.flippedCards.delete(cardId);
    } else {
      this.flippedCards.add(cardId);
    }
  }

  isCardFlipped(cardId: string): boolean {
    return this.flippedCards.has(cardId);
  }

  flipAllCards() {
    this.cards.forEach((card) => {
      this.flippedCards.add(card.id);
    });
  }

  resetAllFlips() {
    this.flippedCards.clear();
  }

  // Методы для работы с пагинацией
  setCurrentPage(page: number) {
    this.currentPage = page;
  }

  setPagination(page: number, totalPages: number, totalItems: number) {
    this.currentPage = page;
    this.totalPages = totalPages;
    this.totalItems = totalItems;
  }

  // Методы для работы с прогрессом
  updateCardProgress(cardId: string, action: "increment" | "decrement") {
    const card = this.cards.find((c) => c.id === cardId);
    if (card) {
      runInAction(() => {
        if (action === "increment") {
          card.currentUserSolvedCount += 1;
        } else if (action === "decrement" && card.currentUserSolvedCount > 0) {
          card.currentUserSolvedCount -= 1;
        }
      });
    }
  }

  // Новые методы для интервального повторения
  setStudyMode(mode: "classic" | "spaced") {
    this.studyMode = mode;
  }

  setDueCards(cards: DueCard[]) {
    this.dueCards = cards;
  }

  setCurrentDueCard(card: DueCard | null) {
    this.currentDueCard = card;
  }

  setGeneralStats(stats: GeneralStats | null) {
    this.generalStats = stats;
  }

  setReviewMode(isReview: boolean) {
    this.isReviewMode = isReview;
  }

  // Обновление карточки после повторения
  updateCardAfterReview(cardId: string, reviewResponse: ReviewResponse) {
    runInAction(() => {
      // Обновляем в списке due cards
      const dueCardIndex = this.dueCards.findIndex(
        (card) => card.id === cardId
      );
      if (dueCardIndex >= 0) {
        this.dueCards.splice(dueCardIndex, 1);
      }

      // Обновляем в обычном списке карточек если есть
      const cardIndex = this.cards.findIndex((card) => card.id === cardId);
      if (cardIndex >= 0) {
        // Обновляем счетчик для обратной совместимости
        this.cards[cardIndex].currentUserSolvedCount =
          reviewResponse.reviewCount;
      }
    });
  }

  // Геттеры
  get filteredCardsCount(): number {
    return this.totalItems;
  }

  get solvedCardsCount(): number {
    return this.cards.filter((card) => card.currentUserSolvedCount > 0).length;
  }

  get averageSolvedCount(): number {
    if (this.cards.length === 0) return 0;
    const totalSolved = this.cards.reduce(
      (sum, card) => sum + card.currentUserSolvedCount,
      0
    );
    return Math.round((totalSolved / this.cards.length) * 100) / 100;
  }

  get hasNextPage(): boolean {
    return this.currentPage < this.totalPages;
  }

  get hasPrevPage(): boolean {
    return this.currentPage > 1;
  }

  // Геттеры для статистики интервального повторения
  get dueCardsCount(): number {
    // Если есть загруженные dueCards (например, на странице /theory/review), используем их
    if (this.dueCards.length > 0) {
      return this.dueCards.length;
    }
    // Иначе используем данные из generalStats (learning + review карточки)
    return (
      (this.generalStats?.learning || 0) + (this.generalStats?.review || 0)
    );
  }

  get overdueCardsCount(): number {
    return this.dueCards.filter((card) => card.isOverdue).length;
  }

  get newCardsCount(): number {
    return this.generalStats?.new || 0;
  }

  get learningCardsCount(): number {
    return this.generalStats?.learning || 0;
  }

  get reviewCardsCount(): number {
    return this.generalStats?.review || 0;
  }

  // Методы для навигации по карточкам
  getNextCard(currentCardId: string): TheoryCard | null {
    const currentIndex = this.cards.findIndex(
      (card) => card.id === currentCardId
    );
    if (currentIndex >= 0 && currentIndex < this.cards.length - 1) {
      return this.cards[currentIndex + 1];
    }
    return null;
  }

  getPrevCard(currentCardId: string): TheoryCard | null {
    const currentIndex = this.cards.findIndex(
      (card) => card.id === currentCardId
    );
    if (currentIndex > 0) {
      return this.cards[currentIndex - 1];
    }
    return null;
  }
}
