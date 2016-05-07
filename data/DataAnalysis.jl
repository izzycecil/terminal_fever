module DataAnalysis
using Plotly

"""
    build_entry_vect(data)

Builds a distribution representing how "skilled" the users in the survey are.
Essentially just sums the numeric data from the entry survey.
"""
function build_entry_vect(data)
    # Grab only the numerical answers from our data. Row = person, col = question.
    ndat = data[2:27,8:20]
    ndat = map(x -> if x == "" 0 else 4 - x end, ndat)
    return mapslices(sum, ndat, [2])'
end

function plot_entry_vect(vec)
    d      = [ Dict("x" => x', "type"=>"histogram") ]
    layout =   Dict("title" => "User Skills",
                    "xaxis" => Dict("title" => "Skill Level")
                    "yaxis" => Dict("title" => ))

    r = Plotly.plot(d, Dict("filename" => "skill_hist",
                            "fileopt"  => "overwrite",
                            "layout"   => layout) )
    return r
end
end
