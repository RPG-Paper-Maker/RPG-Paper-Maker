/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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

    SuperListItem * shape() const;
    void setShape(SuperListItem *shape);
    void setAreNegIDsEnabled(bool b);

    void setShapeKind(CustomShapeKind kind);
    void changeShape(SuperListItem *shape);
    void dropFiles(QStringList &files);

private:
    Ui::PanelShapes *ui;
    CustomShapeKind m_shapeKind;
    SuperListItem *m_shape;
    bool m_areNegIDsEnabled;

    void showShapes(bool b);
    void updateShapeItem(QStandardItem *item);
    void loadAvailableContent(int row = -1);
    void loadContentFromFolder(QString path, bool isBR = false, QString dlc = "");
    void deleteContent(QString path);
    void moveContent();
    void updateShape();
    void translate();

public slots:
    void showAvailableContent(bool b);

private slots:
    void on_listIDsIndexChanged(QModelIndex index, QModelIndex);
    void on_listIndexChanged(QModelIndex index, QModelIndex);
    void on_pushButtonMove_clicked();
    void on_pushButtonRefresh_clicked();
    void on_pushButtonAdd_clicked();
    void on_pushButtonDelete_clicked();
    void deletingContent(SuperListItem *super, int row);
    void on_treeViewAvailableContentDoubleClicked(QModelIndex);
    void on_pushButtonDLC_clicked();
    void on_pushButtonExport_clicked();
};

#endif // PANELSHAPES_H
