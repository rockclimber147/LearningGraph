import { MarkdownMetaData, type RawMarkdownMetaData } from "../models/markdown";

type MetaDataFormProps = {
    metadata: MarkdownMetaData;
    onMetaDataChange: (newMetadata: MarkdownMetaData) => void;
};

export default function MarkdownMetaDataComponent({ metadata, onMetaDataChange }: MetaDataFormProps) {
    
    const handleArrayChange = (field: keyof RawMarkdownMetaData, value: string) => {
        const newArray = value.split(',').map(s => s.trim()).filter(s => s.length > 0);
        
        onMetaDataChange(new MarkdownMetaData({
            ...metadata,
            [field]: newArray
        }));
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onMetaDataChange(new MarkdownMetaData({
            ...metadata,
            title: e.target.value
        }));
    };
    
    const arrayToString = (arr: string[]) => arr.join(', ');

    const inputClasses = "w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out";
    const labelClasses = "block text-sm font-medium mt-2";

    return (
        <div className="p-4 rounded-lg shadow-md mb-4 border border-gray-200">       
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className={labelClasses}>Title</label>
                    <input 
                        type="text" 
                        value={metadata.title} 
                        onChange={handleTitleChange} 
                        className={inputClasses} 
                    />
                </div>
                
                <div>
                    <label className={labelClasses}>Tags (Comma Separated)</label>
                    <input 
                        type="text" 
                        value={arrayToString(metadata.tags)} 
                        onChange={(e) => handleArrayChange('tags', e.target.value)}
                        className={inputClasses} 
                        placeholder="react, setup, node"
                    />
                </div>
            </div>

            <label className={labelClasses}>Prerequisites (File Names, Comma Separated)</label>
            <input 
                type="text" 
                value={arrayToString(metadata.prerequisites)} 
                onChange={(e) => handleArrayChange('prerequisites', e.target.value)}
                className={inputClasses} 
                placeholder="filename1.md, filename2.md"
            />
            
            <label className={labelClasses}>Related Topics (File Names, Comma Separated)</label>
            <input 
                type="text" 
                value={arrayToString(metadata.related)} 
                onChange={(e) => handleArrayChange('related', e.target.value)}
                className={inputClasses} 
                placeholder="related_topic.md, advanced_topic.md"
            />
        </div>
    );
};