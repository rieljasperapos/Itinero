import { Button } from "@/components/ui/button";
import {
  CirclePlus,
  Filter,
  Calendar,
  History,
  PlayCircle,
  ArrowUpDown,
} from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterType, SortType } from "@/lib/itinerary/filters";

interface DashboardActionsProps {
  filter: FilterType;
  sort: SortType;
  onFilterChange: (value: FilterType) => void;
  onSortChange: (value: SortType) => void;
}

export const DashboardActions = ({
  filter,
  sort,
  onFilterChange,
  onSortChange,
}: DashboardActionsProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 bg-card/50 p-4 rounded-lg border border-border/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Link href="/itinerary/create">
        <Button
          variant="default"
          size="lg"
          className="group hover:shadow-lg transition-all duration-300"
        >
          <CirclePlus
            className="mr-2 size-5 group-hover:rotate-90 transition-transform duration-300"
            strokeWidth={1.5}
          />
          Create New Trip
        </Button>
      </Link>

      <div className="flex items-center gap-3">
        <Select value={filter} onValueChange={onFilterChange}>
          <SelectTrigger className="w-auto sm:w-[140px] bg-background">
            <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Filter trips" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ongoing">
              <div className="flex items-center">
                <PlayCircle className="mr-2 h-4 w-4 text-primary" />
                Ongoing
              </div>
            </SelectItem>
            <SelectItem value="upcoming">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-primary" />
                Upcoming
              </div>
            </SelectItem>
            <SelectItem value="past">
              <div className="flex items-center">
                <History className="mr-2 h-4 w-4 text-primary" />
                Past
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={onSortChange}>
          <SelectTrigger className="w-auto sm:w-[140px] bg-background">
            <ArrowUpDown className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="title">Title A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
