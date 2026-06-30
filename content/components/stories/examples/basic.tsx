import {
  Stories,
  StoriesContent,
  Story,
  StoryImage,
  StoryAuthor,
  StoryAuthorImage,
  StoryAuthorName,
  StoryTitle,
  StoryOverlay,
} from "@/components/ui/stories"

const items = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=600&fit=crop",
    title: "Mountain Lake",
    author: "Alex Chen",
    avatar: "https://github.com/alex.png",
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=600&fit=crop",
    title: "Coastal View",
    author: "Sarah Kim",
    avatar: "https://github.com/sarah.png",
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=600&fit=crop",
    title: "Forest Light",
    author: "Mike Johnson",
    avatar: "https://github.com/mike.png",
  },
]

export default function StoriesBasicExample() {
  return (
    <Stories className="w-full max-w-sm">
      <StoriesContent>
        {items.map((item) => (
          <Story key={item.id}>
            <StoryImage src={item.image} alt={item.title} />
            <StoryOverlay side="top" />
            <StoryTitle>{item.title}</StoryTitle>
            <StoryOverlay />
            <StoryAuthor>
              <StoryAuthorImage
                src={item.avatar}
                name={item.author}
                fallback={item.author.charAt(0)}
              />
              <StoryAuthorName>{item.author}</StoryAuthorName>
            </StoryAuthor>
          </Story>
        ))}
      </StoriesContent>
    </Stories>
  )
}
