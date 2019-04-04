/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef DIALOGCOMMANDSTOPSONG_H
#define DIALOGCOMMANDSTOPSONG_H

// -------------------------------------------------------
//
//  CLASS DialogCommanStopSong
//
//  A generic dialog command for stopping song.
//
// -------------------------------------------------------

#include "dialogcommand.h"

namespace Ui {
class DialogCommandStopSong;
}

class DialogCommandStopSong : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandStopSong(QString title, SongKind kind,
                                   EventCommand *command = nullptr,
                                   SystemCommonObject *object = nullptr,
                                   QStandardItemModel* parameters = nullptr,
                                   QWidget *parent = 0);
    ~DialogCommandStopSong();
    EventCommandKind getCommandKind() const;
    EventCommand* getCommand() const;

protected:
    SongKind m_kind;

    virtual void initialize(EventCommand* command);

private:
    Ui::DialogCommandStopSong *ui;
};

#endif // DIALOGCOMMANDSTOPSONG_H
