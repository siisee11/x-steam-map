import { Trash2 } from "lucide-react";
import { StreamRule } from "../../lib/types/xapi";

const RulesList = ({ rules, onRemove }: { rules: Pick<StreamRule, "value" | "tag">[], onRemove?: (value: string) => void }) => {
  return (
    <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Value</th>
              <th className="px-4 py-2 text-left">Tag</th>
              {onRemove && <th className="px-4 py-2 text-left">Remove</th>}
            </tr>
          </thead>
          <tbody>
            {rules.map((rule, index) => (
              <tr key={index} className="border-b">
                <td className="px-4 py-2">{rule.value}</td>
                <td className="px-4 py-2">{rule.tag || ''}</td>
                {onRemove && <td className="px-4 py-2 text-center"><button onClick={() => onRemove(rule.value)}>
                    <Trash2 className="w-4 h-4" />
                </button></td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  export default RulesList;