/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef PANELSPECIALELEMENTS_H
#define PANELSPECIALELEMENTS_H

#include <QWidget>
#include "systemspritewall.h"
#include "panelsuperlist.h"

// -------------------------------------------------------
//
//  CLASS PanelSpecialElements
//
//  The special elements panel (complete list).
//
// -------------------------------------------------------

namespace Ui {
class PanelSpecialElements;
}

class PanelSpecialElements : public QWidget
{
    Q_OBJECT

public:
    explicit PanelSpecialElements(QWidget *parent = nullptr);
    ~PanelSpecialElements();
    SystemSpecialElement * specialElement() const;

    void initialize(QStandardItemModel *model, PictureKind kind);
    void update(SystemSpecialElement *sys);
    void selectSpecialElement(SystemSpecialElement *sys);
    int currentIndex() const;
    PanelSuperList* superList() const;

private:
    Ui::PanelSpecialElements *ui;
    QList<QSize> m_spacersSize;
    QStandardItemModel *m_model;
    PictureKind m_kind;
    SystemSpecialElement *m_specialElement;

    void hideObject3D();
    void showObject3D();
    void hideMountain();
    void showMountain();
    void showBox();
    void showCustomObject();
    void showCustomObjectCollision(bool b);
    void showAutotiles();
    void hideAutotiles();
    SystemSpecialElement * currentElement() const;
    void translate();

private slots:
    void on_pageSelected(QModelIndex index, QModelIndex);
    void on_comboBoxShape_currentIndexChanged(int index);
    void on_pictureChanged(SystemPicture *picture);
    void on_objChanged();
    void on_comboBoxCollision_currentIndexChanged(int index);
    void on_doubleSpinBoxScale_valueChanged(double d);
    void on_spinBoxSquaresWidth_valueChanged(int i);
    void on_spinBoxPixelsWidth_valueChanged(int i);
    void on_spinBoxSquaresHeight_valueChanged(int i);
    void on_spinBoxPixelsHeight_valueChanged(int i);
    void on_spinBoxSquaresDepth_valueChanged(int i);
    void on_spinBoxPixelsDepth_valueChanged(int i);
    void on_comboBoxStretch_currentIndexChanged(int index);
    void on_comboBoxCollisionMountains_currentIndexChanged(int index);
    void on_checkBoxAnimated_toggled(bool checked);
    void on_comboBoxPosition_currentIndexChanged(int index);
};

#endif // PANELSPECIALELEMENTS_H
