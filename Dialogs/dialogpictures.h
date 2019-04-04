/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef DIALOGPICTURES_H
#define DIALOGPICTURES_H

#include <QDialog>
#include <QStandardItemModel>
#include "picturekind.h"

// -------------------------------------------------------
//
//  CLASS DialogPictures
//
//  A dialog used for editing pictures in the game.
//
// -------------------------------------------------------

namespace Ui {
class DialogPictures;
}

class DialogPictures : public QDialog
{
    Q_OBJECT

public:
    explicit DialogPictures(QWidget *parent = 0);
    ~DialogPictures();
    QStandardItemModel* createFoldersModel() const;
    void addfolders(QIcon& icon,
                    QStandardItem* root,
                    QList<QString>& names,
                    QList<PictureKind>& enums) const;

private:
    Ui::DialogPictures *ui;

private slots:
    void on_folderSelected(const QModelIndex& current, const QModelIndex&);
};

#endif // DIALOGPICTURES_H
