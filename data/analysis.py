import csv
import itertools
from matplotlib import pyplot

qs_entry = {
    'usability': [
        'I think the command line is easy to use.',
        'I think the command line is more usable than a GUI.',
        'I feel comfortable using the shell.',
        'I prefer command line tools to GUI tools.',
        'I think I would prefer the shell if I understood it better (or already do).',
        'I think the shell is easy to learn.'
    ],
    'efficiency': [
        'I use a wide array of commands.',
        'I use control structures in the shell.',
        'I use piping and redirection.'
    ],
    'knowledge': [
        'When presented with a problem, I know the commands to use.',
        'I feel that learning how to use new commands is easy.',
        'I use a wide array of commands.',
        'I feel that I have sufficient knowledge of the shell for what I need.'
    ],
    'qualitative': [
        'Please explain what tasks you commonly carry out on in the shell.',
        'What did you like most about the system?',
        'What do you think needs the most improvements?'
    ]
}

qs_exit = {
    'usability': [
        'This system would improve my usage of the shell.',
        'This system would help me solve problems in the shell.',
        'This system is more usable than a traditional shell.',
        'I find the interface of the system inviting and usable.'
        ],
    'education': [
        'This system would teach me commands in a more effective way that  the status quo.',
        'This system would help me perform automations that I would not make on my own.',
        'Using this system would improve my understanding of all shells.'
        ],
    'intention': [
        'I would prefer this to the normal shell experience',
        'I would use this system in the future.',
        'I would suggest this system to others.'
        ],
    'qualitative': [
        'I would suggest this system to others.',
        'What did you like most about the system?',
        'What do you think needs the most improvements?'
        ]
}

categories = {
    'Usability Rating (Entry)': qs_entry['usability'],
    'Efficiency Rating (Entry)': qs_entry['efficiency'],
    'Knowledge Rating (Entry)': qs_entry['knowledge'],
    'Usability Rating (Exit)': qs_exit['usability'],
    'Education Rating (Exit)': qs_exit['education'],
    'Intention Rating (Exit)': qs_exit['intention']
}

def read_data():
    entry_list = None
    exit_list = None

    # read files
    with open('csv/entry.csv') as file:
        reader = csv.DictReader(file)
        entry_list = [row for row in reader]

    with open('csv/exit.csv') as file:
        reader = csv.DictReader(file)
        exit_list = [row for row in reader]

    return entry_list, exit_list

def organize_data(entry_list, exit_list):
    entered = [d['Full Name'] for d in entry_list]
    exited = set(d['Name'] for d in exit_list)
    people = sorted(int(name) for name in entered if name in exited)

    entry_dict = {}
    exit_dict = {}
    qual_dict = {}

    qual_qs = qs_entry['qualitative'] + qs_exit['qualitative']

    for name in people:
        for d in entry_list:
            if d['Full Name'] == str(name):
                entry_dict[name] = {k:(int(v) if v.isdigit() else v) for k,v in d.items()}
                entry_dict[name].pop('Full Name')
                qual_dict[name] = {qual_qs[0]: entry_dict[name].pop(qual_qs[0])}

        for d in exit_list:
            if d['Name'] == str(name):
                exit_dict[name] = {k:(int(v) if v.isdigit() else v) for k,v in d.items()}
                exit_dict[name].pop('Name')
                qual_dict[name][qual_qs[1]] = exit_dict[name].pop(qual_qs[1])
                qual_dict[name][qual_qs[2]] = exit_dict[name].pop(qual_qs[2])

    full_dict = {}

    for name in entry_dict.keys():
        full_dict[name] = entry_dict[name].copy()
        full_dict[name].update(exit_dict[name])

    return people, entry_dict, exit_dict, full_dict

def crunch_numbers(table, questions, label):
    for k in table.keys():
        sum = 0
        for q in questions:
            sum += table[k][q]

        table[k][label] = '{:.2}'.format(sum / len(questions))

def extend_data(table):
    for label, lst in categories.items():
        crunch_numbers(table, lst, label)

def pull_users(table, key, pred):
    return [k for k, v in table.items() if pred(v.get(key))]

# pull_users(entry_dict, 'Education', lambda x: x == 'Senior')
# pull_users(exit_dict, 'I find the interface of the system inviting and usable.', lambda x: int(x) > 2)

def pull_data(table, users, key):
    return [table[x][key] for x in users]

# seniors = pull_users(entry_dict, 'Education', lambda x: x == 'Senior')
# usability = pull_data(exit_dict, ppl, 'I find the interface of the system inviting and usable.')
# seniors

def by_response(table, key):
    tally = {}
    for k in table.keys():
        if k in tally:
            tally[table[k][key]].append(k)
        else:
            tally[table[k][key]] = [k]
    return tally


def autocolor(table, group, key):
    colors = itertools.cycle(['lightcoral', 'powderblue', 'lightsage', 'moccasin', 'honeydew'])
    edudict = {k:v for v, k in enumerate(['Sophomore', 'Junior', 'Senior', 'Graduate'])}
    data = set(pull_data(table, group, key))

    return list(zip(sorted(data, key=lambda x: edudict.get(x, x)), colors))


def plot_all(table, selector):
    groups = autocolor(table, table.keys(), selector)

    any = next(iter(table.keys()))
    for key in table[any].keys():
        if not isinstance(table[1][key], int):
            continue

        data = []
        count = []
        fig = pyplot.figure()
        pyplot.title(key)

        for g in groups:
            people = pull_users(table, selector, lambda x: x == g[0])
            count.append(len(people))
            data.append(pull_data(table, people, key))

        plt = pyplot.boxplot(data, vert=True, patch_artist=True) # , notch=True)

        for p in zip(plt['boxes'], groups):
            pyplot.setp(p[0], color=p[1][1])
            pyplot.setp(p[0], label=p[1][0])

        xlabels = ["{} ({})".format(x[0], y) for x, y in zip(groups, count)]
        ylabels = ['Disagree [1]', '[2]', '[3]', 'Agree [4]']
        pyplot.xticks(range(1, len(groups) + 1), xlabels)
        pyplot.yticks(range(1, len(groups) + 1), ylabels)
        pyplot.xlabel(selector)
        pyplot.ylim([0, 5])


def get_full_dict():
    entry_list, exit_list = read_data()
    people, entry_dict, exit_dict, full_dict = organize_data(entry_list, exit_list)
    extend_data(full_dict)

    return full_dict

def main():
    full_dict = get_full_dict()

    # Omega Gangsta Mode
    for label in categories.keys():
        plot_all(full_dict, label)
        break

if __name__ == "__main__":
    main()
