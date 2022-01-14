/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

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
        *command = nullptr, QStandardItemModel *properties = nullptr,
        QStandardItemModel *parameters = nullptr, EventCommandKind
        eventCommandKind = EventCommandKind::None, QWidget *parent = nullptr);
    explicit DialogCommandPlaySong(QString title, SystemPlaySong *song);
    ~DialogCommandPlaySong();

    EventCommandKind getCommandKind() const;
    void getCommandList(QVector<QString> &command) const;

    virtual EventCommand* getCommand() const;

protected:
    SongKind m_kind;
    EventCommandKind m_eventCommandKind;
    SystemPlaySong *m_song;

    virtual void initialize(EventCommand *command);
    virtual void dragEnterEvent(QDragEnterEvent *event);
    virtual void dropEvent(QDropEvent *event);

private:
    Ui::DialogCommandPlaySong *ui;

    void translate();

public slots:
    virtual void accept();
    virtual void reject();
    void on_checkBoxSongID_toggled(bool checked);
};

#endif // DIALOGCOMMANDPLAYSONG_H
