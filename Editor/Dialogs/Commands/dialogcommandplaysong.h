/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDPLAYSONG_H
#define DIALOGCOMMANDPLAYSONG_H

// -------------------------------------------------------
//
//  CLASS DialogCommanPlaySong
//
//  A generic dialog command for playing song.
//
// -------------------------------------------------------

#include "dialogcommand.h"
#include "systemplaysong.h"

namespace Ui {
class DialogCommandPlaySong;
}

class DialogCommandPlaySong : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandPlaySong(QString title, SongKind kind, EventCommand
        *command = nullptr, SystemCommonObject *object = nullptr,
        QStandardItemModel *parameters = nullptr, QWidget *parent = nullptr);
    explicit DialogCommandPlaySong(QString title, SystemPlaySong *song);
    ~DialogCommandPlaySong();
    EventCommandKind getCommandKind() const;
    EventCommand* getCommand() const;

protected:
    SongKind m_kind;
    SystemPlaySong *m_song;

    virtual void initialize(EventCommand *command);

private:
    Ui::DialogCommandPlaySong *ui;

    void translate();

public slots:
    virtual void accept();
    virtual void reject();
    void on_checkBoxSongID_toggled(bool checked);
};

#endif // DIALOGCOMMANDPLAYSONG_H
