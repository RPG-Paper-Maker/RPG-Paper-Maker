/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef DIALOGSHAPES_H
#define DIALOGSHAPES_H

// -------------------------------------------------------
//
//  CLASS DialogShapes
//
//  A dialog used for editing shapes in the game.
//
// -------------------------------------------------------

#include <QDialog>
#include <QStandardItemModel>
#include "customshapekind.h"

namespace Ui {
class DialogShapes;
}

class DialogShapes : public QDialog
{
    Q_OBJECT

public:
    explicit DialogShapes(QWidget *parent = nullptr);
    ~DialogShapes();
    QStandardItemModel* createFoldersModel() const;
    void addfolders(QIcon& icon, QStandardItem* root, QList<QString>& names,
        QList<CustomShapeKind>& enums) const;

private:
    Ui::DialogShapes *ui;

private slots:
    void on_folderSelected(const QModelIndex& current, const QModelIndex&);
};

#endif // DIALOGSHAPES_H
