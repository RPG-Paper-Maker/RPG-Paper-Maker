/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef PANELSHAPES_H
#define PANELSHAPES_H

// -------------------------------------------------------
//
//  CLASS PanelShapes
//
//  Panel used for shapes selection.
//
// -------------------------------------------------------

#include <QWidget>
#include "systemcustomshape.h"

namespace Ui {
class PanelShapes;
}

class PanelShapes : public QWidget
{
    Q_OBJECT

public:
    explicit PanelShapes(QWidget *parent = nullptr);
    ~PanelShapes();

    SystemCustomShape * shape() const;
    void setShape(SystemCustomShape *shape);

    void setCustomShapeKind(CustomShapeKind kind);
    void changeShape(SystemCustomShape *shape);

private:
    Ui::PanelShapes *ui;
    CustomShapeKind m_shapeKind;
    SystemCustomShape *m_shape;

    void showShapes(bool b);
    void updateShapeItem(QStandardItem *item);
    void loadAvailableContent(int row = -1);
    void loadContentFromFolder(QString path, bool isBR);
    void deleteContent(QString path);
    void moveContent();
    void updateShape();

public slots:
    void showAvailableContent(bool b);

private slots:
    void on_listIDsIndexChanged(QModelIndex index, QModelIndex);
    void on_listIndexChanged(QModelIndex index, QModelIndex);
    void on_pushButtonMove_clicked();
    void on_pushButtonRefresh_clicked();
    void on_pushButtonAdd_clicked();
    void deletingContent(SuperListItem *super, int row);
    void on_treeViewAvailableContentDoubleClicked(QModelIndex);
};

#endif // PANELSHAPES_H
