import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BlogsTable from "../blogs/BlogList";
import TagsList from "../tags/TagsList";
import { AddTag } from "../tags/add-tag/AddTag";

export function BlogsTabs() {
  return (
    <div className="flex w-full flex-col gap-6">
      <Tabs defaultValue="blogs" className="w-full">
        <TabsList>
          <TabsTrigger value="blogs">Blogs</TabsTrigger>
          <TabsTrigger value="tags">Tags</TabsTrigger>
        </TabsList>

        <TabsContent value="blogs" className="w-full">
          <Card className="w-full">
            <CardHeader>
              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-800 dark:text-white/90">
                Blogs
              </h3>
            </CardHeader>
            <CardContent className="w-full">
              <BlogsTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tags" className="w-full">
          <Card className="w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-800 dark:text-white/90">
                  Tags
                </h3>
                <AddTag />
              </div>
            </CardHeader>
            <CardContent className="w-full">
              <TagsList />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
