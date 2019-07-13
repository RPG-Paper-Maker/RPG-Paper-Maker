/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
