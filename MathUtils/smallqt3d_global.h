/**************************************************************************
**
**    Copyright (C) 2013 by Philip Schuchardt
**    www.cavewhere.com
**
**************************************************************************/


#ifndef SMALLQT3D_GLOBAL_H
#define SMALLQT3D_GLOBAL_H

#include <QtCore/qglobal.h>

#if defined(Q_MATH_3D)
#  define Q_MATH_3D_EXPORT Q_DECL_EXPORT
#else
#  define Q_MATH_3D_EXPORT Q_DECL_IMPORT
#endif

#endif // SMALLQT3D_GLOBAL_H
