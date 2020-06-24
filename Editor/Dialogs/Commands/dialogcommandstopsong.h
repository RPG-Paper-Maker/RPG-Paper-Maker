/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
                                   QWidget *parent = nullptr);
    ~DialogCommandStopSong();
    EventCommandKind getCommandKind() const;
    EventCommand* getCommand() const;

protected:
    SongKind m_kind;

    virtual void initialize(EventCommand* command);

private:
    Ui::DialogCommandStopSong *ui;

    void translate();
};

#endif // DIALOGCOMMANDSTOPSONG_H
