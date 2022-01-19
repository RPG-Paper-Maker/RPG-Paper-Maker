/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGSONGS_H
#define DIALOGSONGS_H

// -------------------------------------------------------
//
//  CLASS DialogSongs
//
//  A dialog used for editing songs in the game.
//
// -------------------------------------------------------

#include <QDialog>
#include <QStandardItemModel>
#include "songkind.h"

namespace Ui {
class DialogSongs;
}

class DialogSongs : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSongs(QWidget *parent = nullptr);
    ~DialogSongs();
    QStandardItemModel* createFoldersModel() const;
    void addfolders(QIcon& icon,
                    QStandardItem* root,
                    QList<QString>& names,
                    QList<SongKind>& enums) const;

protected:
    virtual void dragEnterEvent(QDragEnterEvent *event);
    virtual void dropEvent(QDropEvent *event);

private:
    Ui::DialogSongs *ui;

    void translate();

private slots:
    void on_folderSelected(const QModelIndex& current, const QModelIndex&);
};

#endif // DIALOGSONGS_H
