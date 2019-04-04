/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
    explicit DialogSongs(QWidget *parent = 0);
    ~DialogSongs();
    QStandardItemModel* createFoldersModel() const;
    void addfolders(QIcon& icon,
                    QStandardItem* root,
                    QList<QString>& names,
                    QList<SongKind>& enums) const;


private:
    Ui::DialogSongs *ui;

private slots:
    void on_folderSelected(const QModelIndex& current, const QModelIndex&);
};

#endif // DIALOGSONGS_H
