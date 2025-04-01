
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QuestionCategory } from "@/types/qa";

interface FilterControlsProps {
  selectedSort: "recent" | "popular";
  setSelectedSort: (sort: "recent" | "popular") => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: QuestionCategory[];
  resetVoteCount?: () => void;
  isAdmin?: boolean;
}

const FilterControls = ({
  selectedSort,
  setSelectedSort,
  selectedCategory,
  setSelectedCategory,
  categories,
  resetVoteCount,
  isAdmin,
}: FilterControlsProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
      <div className="flex items-center space-x-4">
        <Button
          variant={selectedSort === "recent" ? "default" : "outline"}
          onClick={() => setSelectedSort("recent")}
        >
          Nýjast
        </Button>
        <Button
          variant={selectedSort === "popular" ? "default" : "outline"}
          onClick={() => setSelectedSort("popular")}
        >
          Vinsælast
        </Button>
      </div>
      
      <div className="w-full md:w-auto">
        <Select
          value={selectedCategory}
          onValueChange={setSelectedCategory}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Allir flokkar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Allir flokkar</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {isAdmin && resetVoteCount && (
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            onClick={resetVoteCount}
          >
            Endurstilla atkvæði
          </Button>
        </div>
      )}
    </div>
  );
};

export default FilterControls;
