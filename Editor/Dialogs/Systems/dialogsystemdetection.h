/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGSYSTEMDETECTION_H
#define DIALOGSYSTEMDETECTION_H

#include <QDialog>
#include "systemdetection.h"

// -------------------------------------------------------
//
//  CLASS DialogSystemDetection
//
//  A dialog used for editing the model of a system detection.
//
// -------------------------------------------------------

namespace Ui {
class DialogSystemDetection;
}

class DialogSystemDetection : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemDetection(SystemDetection &detection, QWidget *parent =
        nullptr);
    ~DialogSystemDetection();

private:
    Ui::DialogSystemDetection *ui;
    SystemDetection &m_detection;
    Map *m_map;
    QVector3D *m_position;
    QVector3D *m_positionObject;

    void initialize();
    void updateMap();

private slots:
    void on_lineEditName_textChanged(const QString &text);
    void on_spinBoxFieldLeft_valueChanged(int i);
    void on_spinBoxFieldRight_valueChanged(int i);
    void on_spinBoxFieldTop_valueChanged(int i);
    void on_spinBoxFieldBot_valueChanged(int i);
    void on_spinBoxHeightSquares_valueChanged(int i);
    void on_spinBoxHeightPixels_valueChanged(int i);
    void on_comboBoxAutomatic_currentIndexChanged(int index);
    void on_pushButtonGenerate_pressed();
};

#endif // DIALOGSYSTEMDETECTION_H
